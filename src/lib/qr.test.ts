import { describe, it, expect } from "vitest";
import { isValidQrInput, clampSize, qrFileName, MAX_QR_INPUT_LENGTH } from "./qr";

describe("isValidQrInput", () => {
  it("rejects empty/whitespace", () => {
    expect(isValidQrInput("")).toBe(false);
    expect(isValidQrInput("   ")).toBe(false);
  });
  it("accepts normal text", () => {
    expect(isValidQrInput("https://example.com")).toBe(true);
  });
  it("rejects over-long input", () => {
    expect(isValidQrInput("a".repeat(MAX_QR_INPUT_LENGTH + 1))).toBe(false);
    expect(isValidQrInput("a".repeat(MAX_QR_INPUT_LENGTH))).toBe(true);
  });
});

describe("clampSize", () => {
  it("clamps to the 64..1024 range", () => {
    expect(clampSize(10)).toBe(64);
    expect(clampSize(5000)).toBe(1024);
    expect(clampSize(300)).toBe(300);
  });
  it("falls back on NaN", () => {
    expect(clampSize(Number.NaN)).toBe(320);
  });
});

describe("qrFileName", () => {
  it("builds png/svg names", () => {
    expect(qrFileName("png")).toBe("qr-code.png");
    expect(qrFileName("svg")).toBe("qr-code.svg");
  });
});
