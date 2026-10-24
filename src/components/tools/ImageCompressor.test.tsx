import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the compression lib so the test doesn't need a real canvas encoder.
vi.mock("@/lib/image-compression", async () => {
  const actual = await vi.importActual<typeof import("@/lib/image-compression")>(
    "@/lib/image-compression",
  );
  return {
    ...actual,
    compressImage: vi.fn(async () => ({
      blob: new Blob([new Uint8Array(100)], { type: "image/jpeg" }),
      width: 640,
      height: 480,
    })),
  };
});

import { ImageCompressor } from "./ImageCompressor";
import { compressImage } from "@/lib/image-compression";

beforeEach(() => {
  // jsdom lacks object URL + Image load plumbing; stub what the component uses.
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = vi.fn();
  vi.clearAllMocks();
});

function makeImageFile() {
  return new File([new Uint8Array(1000)], "photo.png", { type: "image/png" });
}

describe("ImageCompressor", () => {
  it("shows controls after a file is selected", async () => {
    const user = userEvent.setup();
    render(<ImageCompressor />);
    const input = screen.getByLabelText("Choose image") as HTMLInputElement;
    await user.upload(input, makeImageFile());

    expect(await screen.findByText(/photo\.png/)).toBeInTheDocument();
    expect(screen.getByLabelText("Output format")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /compress image/i })).toBeInTheDocument();
  });

  it("rejects non-image files", async () => {
    render(<ImageCompressor />);
    // Drop a non-image file onto the drop zone. The drop path doesn't apply the
    // input's accept filter, so it exercises the component's own validation.
    const dropZone = screen.getByText(/drag & drop/i).closest("div")!;
    const textFile = new File(["x"], "notes.txt", { type: "text/plain" });
    fireEvent.drop(dropZone, { dataTransfer: { files: [textFile] } });
    expect(await screen.findByRole("alert")).toHaveTextContent(/image file/i);
  });

  it("compresses and shows the reduction + download", async () => {
    const user = userEvent.setup();
    render(<ImageCompressor />);
    const input = screen.getByLabelText("Choose image") as HTMLInputElement;
    await user.upload(input, makeImageFile());

    await user.click(screen.getByRole("button", { name: /compress image/i }));

    await waitFor(() => expect(compressImage).toHaveBeenCalledTimes(1));
    // 1000 -> 100 bytes = 90% reduction
    expect(await screen.findByText(/90%/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });
});
