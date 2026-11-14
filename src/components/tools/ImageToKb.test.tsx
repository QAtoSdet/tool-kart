import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the canvas-based wrapper; the size search itself is tested in image-target-size.test.ts.
vi.mock("@/lib/image-compression", async () => {
  const actual = await vi.importActual<typeof import("@/lib/image-compression")>(
    "@/lib/image-compression",
  );
  return { ...actual, compressToTargetSize: vi.fn() };
});

import { ImageToKb, formatKb } from "./ImageToKb";
import { compressToTargetSize } from "@/lib/image-compression";

const mocked = vi.mocked(compressToTargetSize);

beforeEach(() => {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = vi.fn();
  vi.clearAllMocks();
});

const photo = () => new File([new Uint8Array(2_400_000)], "photo.png", { type: "image/png" });

async function upload() {
  const user = userEvent.setup();
  render(<ImageToKb />);
  await user.upload(screen.getByLabelText("Choose image") as HTMLInputElement, photo());
  return user;
}

describe("ImageToKb", () => {
  it("defaults to 50 KB and switches target via presets", async () => {
    const user = await upload();
    expect(screen.getByRole("button", { name: /under 50 KB/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "20 KB" }));
    expect(screen.getByRole("button", { name: "20 KB" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /under 20 KB/ })).toBeInTheDocument();
  });

  it("compresses to the target and offers a download", async () => {
    mocked.mockResolvedValue({
      blob: new Blob([new Uint8Array(48_200)]),
      width: 800,
      height: 600,
      quality: 0.71,
    });
    const user = await upload();
    await user.click(screen.getByRole("button", { name: /under 50 KB/ }));
    await waitFor(() => expect(mocked).toHaveBeenCalledWith(expect.any(File), 50, undefined, 0));
    expect(await screen.findByRole("status")).toHaveTextContent("48.2 KB");
    expect(screen.getByText(/800 × 600 px · JPG quality 71%/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download jpg/i })).toBeInTheDocument();
  });

  it("passes the optional max width", async () => {
    mocked.mockResolvedValue({ blob: new Blob([new Uint8Array(10)]), width: 600, height: 450, quality: 0.9 });
    const user = await upload();
    await user.type(screen.getByLabelText(/max width/i), "600");
    await user.click(screen.getByRole("button", { name: /under 50 KB/ }));
    await waitFor(() => expect(mocked).toHaveBeenCalledWith(expect.any(File), 50, 600, 0));
  });

  it("explains when the target can't be met", async () => {
    mocked.mockResolvedValue(null);
    const user = await upload();
    await user.click(screen.getByRole("button", { name: /under 50 KB/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't get this image under 50 KB/i);
  });

  it("validates a custom size", async () => {
    await upload();
    fireEvent.change(screen.getByLabelText("Custom size in KB"), { target: { value: "2" } });
    expect(screen.getByRole("alert")).toHaveTextContent(/between 5 and 5000/);
    expect(screen.getByRole("button", { name: /under/ })).toBeDisabled();
  });
});

describe("formatKb", () => {
  it("rounds down so a file under the limit never reads as the limit", () => {
    expect(formatKb(49_517)).toBe("49.5 KB"); // real 50 KB browser result
    expect(formatKb(49_990)).toBe("49.9 KB");
    expect(formatKb(19_749)).toBe("19.7 KB");
    expect(formatKb(6_468_552)).toBe("6468 KB");
  });
});

describe("ImageToKb — stale results", () => {
  it("discards a run that finishes after a new file was chosen", async () => {
    let finish!: (v: Awaited<ReturnType<typeof compressToTargetSize>>) => void;
    mocked.mockImplementationOnce(() => new Promise((r) => (finish = r)));
    const user = await upload();
    await user.click(screen.getByRole("button", { name: /under 50 KB/ }));
    await user.upload(
      screen.getByLabelText("Choose image") as HTMLInputElement,
      new File([new Uint8Array(10)], "second.png", { type: "image/png" }),
    );
    finish({ blob: new Blob([new Uint8Array(100)]), width: 10, height: 10, quality: 0.9 });
    await waitFor(() => expect(screen.getByRole("button", { name: /under 50 KB/ })).toBeEnabled());
    expect(screen.queryByRole("button", { name: /download jpg/i })).not.toBeInTheDocument();
  });
});

describe("ImageToKb — minimum size (exam presets)", () => {
  async function uploadWith(props: { defaultKb: number; minKb: number; presets?: number[] }) {
    const user = userEvent.setup();
    render(<ImageToKb {...props} />);
    await user.upload(screen.getByLabelText("Choose image") as HTMLInputElement, photo());
    return user;
  }

  it("passes the minimum to the compressor and shows the allowed range", async () => {
    mocked.mockResolvedValue({ blob: new Blob([new Uint8Array(19_000)]), width: 400, height: 150, quality: 0.8 });
    const user = await uploadWith({ defaultKb: 20, minKb: 10, presets: [] });
    expect(screen.queryByRole("button", { name: "50 KB" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /under 20 KB/ }));
    await waitFor(() => expect(mocked).toHaveBeenCalledWith(expect.any(File), 20, undefined, 10));
    expect(await screen.findByRole("status")).toHaveTextContent("allowed 10–20 KB");
  });

  it("warns instead of claiming success when the file is under the minimum", async () => {
    // 10,000 bytes < 10 × 1,024: under a 10 KB minimum by the stricter count.
    mocked.mockResolvedValue({ blob: new Blob([new Uint8Array(10_000)]), width: 140, height: 60, quality: 1 });
    const user = await uploadWith({ defaultKb: 20, minKb: 10 });
    await user.click(screen.getByRole("button", { name: /under 20 KB/ }));
    expect(await screen.findByRole("status")).toHaveTextContent(/below the 10 KB minimum/);
    expect(screen.queryByText(/^Done:/)).not.toBeInTheDocument();
  });
});
