import { describe, it, expect } from "vitest";
import {
  fitWithin,
  formatBytes,
  reductionPercent,
  outputFileName,
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
