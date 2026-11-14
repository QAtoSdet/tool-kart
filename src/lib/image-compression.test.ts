import { describe, it, expect } from "vitest";
import {
  fitWithin,
  formatBytes,
  reductionPercent,
  outputFileName,
  convertedFileName,
  defaultConversionTarget,
  detectImageFormat,
  isHeicFile,
} from "./image-compression";

describe("fitWithin", () => {
  it("keeps size when it already fits", () => {
    expect(fitWithin({ width: 800, height: 600 }, 1000, 1000)).toEqual({
      width: 800,
      height: 600,
    });
  });

  it("scales down preserving aspect ratio by max width", () => {
    expect(fitWithin({ width: 2000, height: 1000 }, 1000)).toEqual({ width: 1000, height: 500 });
  });

  it("scales down by the more restrictive of width/height", () => {
    // width scale = 0.5, height scale = 0.25 -> use 0.25
    expect(fitWithin({ width: 2000, height: 2000 }, 1000, 500)).toEqual({
      width: 500,
      height: 500,
    });
  });

  it("never upscales", () => {
    expect(fitWithin({ width: 400, height: 300 }, 5000, 5000)).toEqual({
      width: 400,
      height: 300,
    });
  });

  it("handles zero/invalid dimensions", () => {
    expect(fitWithin({ width: 0, height: 0 }, 100)).toEqual({ width: 0, height: 0 });
  });
});

describe("formatBytes", () => {
  it("formats bytes, KB and MB", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.00 MB");
  });
});

describe("reductionPercent", () => {
  it("computes percentage reduction", () => {
    expect(reductionPercent(1000, 250)).toBe(75);
  });
  it("returns 0 when output is not smaller", () => {
    expect(reductionPercent(1000, 1200)).toBe(0);
  });
  it("returns 0 for invalid original", () => {
    expect(reductionPercent(0, 100)).toBe(0);
  });
});

describe("outputFileName", () => {
  it("replaces extension and appends -compressed", () => {
    expect(outputFileName("photo.PNG", "image/jpeg")).toBe("photo-compressed.jpg");
    expect(outputFileName("holiday.jpeg", "image/webp")).toBe("holiday-compressed.webp");
    expect(outputFileName("noext", "image/png")).toBe("noext-compressed.png");
  });
});

describe("detectImageFormat", () => {
  const f = (name: string, type: string) => ({ name, type });
  it("trusts standard and common non-standard MIME types", () => {
    expect(detectImageFormat(f("a.jpg", "image/jpeg"))).toBe("image/jpeg");
    expect(detectImageFormat(f("a.jpg", "image/jpg"))).toBe("image/jpeg");
    expect(detectImageFormat(f("a.jpg", "image/pjpeg"))).toBe("image/jpeg");
    expect(detectImageFormat(f("a.png", "image/x-png"))).toBe("image/png");
    expect(detectImageFormat(f("a", "IMAGE/WEBP"))).toBe("image/webp");
  });
  it("falls back to the extension when the MIME type is missing or generic", () => {
    expect(detectImageFormat(f("scan.JPEG", ""))).toBe("image/jpeg");
    expect(detectImageFormat(f("photo.jfif", "application/octet-stream"))).toBe("image/jpeg");
    expect(detectImageFormat(f("logo.png", ""))).toBe("image/png");
  });
  it("rejects other formats and a misleading extension", () => {
    expect(detectImageFormat(f("anim.gif", "image/gif"))).toBeNull();
    expect(detectImageFormat(f("photo.heic", "image/heic"))).toBeNull();
    expect(detectImageFormat(f("fake.jpg", "application/pdf"))).toBeNull();
    expect(detectImageFormat(f("noext", ""))).toBeNull();
  });
});

describe("isHeicFile", () => {
  it("spots HEIC/HEIF by MIME type or extension", () => {
    expect(isHeicFile({ name: "IMG_1.HEIC", type: "" })).toBe(true);
    expect(isHeicFile({ name: "x", type: "image/heif" })).toBe(true);
    expect(isHeicFile({ name: "x.jpg", type: "image/jpeg" })).toBe(false);
  });
});

describe("defaultConversionTarget", () => {
  it("never defaults to the input's own format", () => {
    for (const fmt of ["image/jpeg", "image/png", "image/webp"] as const) {
      expect(defaultConversionTarget(fmt)).not.toBe(fmt);
    }
  });
});

describe("convertedFileName", () => {
  it("replaces the input extension and marks the output as converted", () => {
    expect(convertedFileName("photo.PNG", "image/jpeg")).toBe("photo-converted.jpg");
    expect(convertedFileName("holiday.jpeg", "image/webp")).toBe("holiday-converted.webp");
    expect(convertedFileName("noext", "image/png")).toBe("noext-converted.png");
  });
});
