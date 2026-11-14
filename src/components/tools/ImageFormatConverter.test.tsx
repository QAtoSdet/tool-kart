import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/image-compression", async () => {
  const actual = await vi.importActual<typeof import("@/lib/image-compression")>(
    "@/lib/image-compression",
  );
  return {
    ...actual,
    compressImage: vi.fn(async () => ({
      blob: new Blob([new Uint8Array(100)], { type: "image/webp" }),
      width: 640,
      height: 480,
    })),
  };
});

import { ImageFormatConverter } from "./ImageFormatConverter";
import { compressImage } from "@/lib/image-compression";

beforeEach(() => {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = vi.fn();
  vi.clearAllMocks();
});

describe("ImageFormatConverter", () => {
  it("converts a supported image and offers a download", async () => {
    const user = userEvent.setup();
    render(<ImageFormatConverter />);

    await user.upload(
      screen.getByLabelText("Choose image"),
      new File([new Uint8Array(500)], "photo.png", { type: "image/png" }),
    );
    await user.selectOptions(screen.getByLabelText("Convert to"), "image/webp");
    await user.click(screen.getByRole("button", { name: "Convert image" }));

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledWith(
        expect.objectContaining({ name: "photo.png" }),
        { format: "image/webp", quality: 0.92 },
      );
    });
    expect(await screen.findByRole("img", { name: "Converted to WebP" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download converted image" })).toBeInTheDocument();
  });

  it("rejects HEIC files with a clear message", async () => {
    render(<ImageFormatConverter />);
    const heic = new File([new Uint8Array(10)], "photo.heic", { type: "image/heic" });

    fireEvent.drop(screen.getByText(/drag & drop a jpg/i).closest("div")!, {
      dataTransfer: { files: [heic] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(/HEIC\/HEIF files are not supported/i);
    expect(screen.queryByLabelText("Convert to")).not.toBeInTheDocument();
  });

  it("rejects non-image files", async () => {
    render(<ImageFormatConverter />);
    const textFile = new File(["text"], "notes.txt", { type: "text/plain" });

    fireEvent.drop(screen.getByText(/drag & drop a jpg/i).closest("div")!, {
      dataTransfer: { files: [textFile] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(/choose a JPG, PNG or WebP image/i);
  });
});

describe("ImageFormatConverter — review fixes", () => {
  const upload = async (file: File) => {
    const user = userEvent.setup();
    render(<ImageFormatConverter />);
    await user.upload(screen.getByLabelText("Choose image"), file);
    return user;
  };
  const mocked = vi.mocked(compressImage);

  it("doesn't default to the input's own format (JPG input → PNG)", async () => {
    await upload(new File([new Uint8Array(10)], "photo.jpg", { type: "image/jpeg" }));
    expect(screen.getByLabelText("Convert to")).toHaveValue("image/png");
    expect(screen.getByRole("option", { name: "JPG (same as original)" })).toBeInTheDocument();
  });

  it("keeps JPG as the default for a PNG input", async () => {
    await upload(new File([new Uint8Array(10)], "shot.png", { type: "image/png" }));
    expect(screen.getByLabelText("Convert to")).toHaveValue("image/jpeg");
  });

  it('accepts a .jpg reported as the non-standard "image/jpg"', async () => {
    await upload(new File([new Uint8Array(10)], "x.jpg", { type: "image/jpg" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Convert to")).toBeInTheDocument();
  });

  it("reports when the converted file is smaller", async () => {
    mocked.mockResolvedValueOnce({ blob: new Blob([new Uint8Array(250)]), width: 10, height: 10 });
    const user = await upload(new File([new Uint8Array(1000)], "a.png", { type: "image/png" }));
    await user.click(screen.getByRole("button", { name: "Convert image" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/75% smaller/);
  });

  it("warns when the converted file is larger", async () => {
    mocked.mockResolvedValueOnce({ blob: new Blob([new Uint8Array(2000)]), width: 10, height: 10 });
    const user = await upload(new File([new Uint8Array(1000)], "a.png", { type: "image/png" }));
    await user.click(screen.getByRole("button", { name: "Convert image" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/larger than the original/);
  });

  it("says 'about the same size' instead of 'larger' when sizes match", async () => {
    mocked.mockResolvedValueOnce({ blob: new Blob([new Uint8Array(1005)]), width: 10, height: 10 });
    const user = await upload(new File([new Uint8Array(1000)], "a.png", { type: "image/png" }));
    await user.click(screen.getByRole("button", { name: "Convert image" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/about the same size/);
  });

  it("discards a conversion that finishes after a new file was chosen", async () => {
    let finish!: (v: Awaited<ReturnType<typeof compressImage>>) => void;
    mocked.mockImplementationOnce(() => new Promise((r) => (finish = r)));
    const user = await upload(new File([new Uint8Array(10)], "first.png", { type: "image/png" }));
    await user.click(screen.getByRole("button", { name: "Convert image" }));

    await user.upload(
      screen.getByLabelText("Choose image"),
      new File([new Uint8Array(10)], "second.png", { type: "image/png" }),
    );
    finish({ blob: new Blob([new Uint8Array(5)]), width: 1, height: 1 });

    await waitFor(() => expect(screen.getByRole("button", { name: "Convert image" })).toBeEnabled());
    expect(screen.queryByRole("button", { name: "Download converted image" })).not.toBeInTheDocument();
    expect(screen.getByText(/second\.png/)).toBeInTheDocument();
  });
});
