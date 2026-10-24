import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The `qrcode` library uses canvas for toDataURL, which jsdom doesn't implement.
// Mock it so the component logic (debounced generation, downloads, validation)
// is what we test, not the third-party encoder.
vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn(async () => "data:image/png;base64,MOCKPNG"),
    toString: vi.fn(async () => "<svg data-mock='qr'></svg>"),
  },
}));

import { QrCodeGenerator } from "./QrCodeGenerator";

beforeEach(() => {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = vi.fn();
  vi.clearAllMocks();
});

describe("QrCodeGenerator", () => {
  it("generates a QR preview for the default input", async () => {
    render(<QrCodeGenerator />);
    const img = await screen.findByAltText("Generated QR code");
    expect(img).toHaveAttribute("src", "data:image/png;base64,MOCKPNG");
    expect(screen.getByRole("button", { name: /download png/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download svg/i })).toBeInTheDocument();
  });

  it("regenerates when the text changes", async () => {
    const user = userEvent.setup();
    render(<QrCodeGenerator />);
    await screen.findByAltText("Generated QR code");

    const textarea = screen.getByLabelText("Text or URL");
    await user.clear(textarea);
    await user.type(textarea, "hello world");

    await waitFor(() => expect(screen.getByAltText("Generated QR code")).toBeInTheDocument());
  });

  it("shows an error for over-long input and hides the preview", async () => {
    const user = userEvent.setup();
    render(<QrCodeGenerator />);
    const textarea = screen.getByLabelText("Text or URL");
    await user.clear(textarea);
    // Paste is far faster than typing 2000+ chars.
    await user.click(textarea);
    await user.paste("a".repeat(2100));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too long/i);
    expect(screen.queryByAltText("Generated QR code")).not.toBeInTheDocument();
  });
});
