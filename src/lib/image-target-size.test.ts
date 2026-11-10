import { describe, it, expect, vi } from "vitest";
import {
  BYTES_PER_KB,
  MIN_QUALITY,
  MIN_SIDE,
  searchTargetSize,
  targetFileName,
  type Encoder,
} from "./image-compression";

/**
 * Fake JPEG encoder: size grows with pixel count and with quality, like a real one.
 * A 4000×3000 photo is ~1.6 MB at quality 0.4 and ~5 MB at 0.92.
 */
function fakeEncoder() {
  return vi.fn<Encoder>(async ({ width, height }, q) => {
    const bytes = Math.round(width * height * (0.05 + 0.5 * q * q));
    return new Blob([new Uint8Array(bytes)]);
  });
}

const PHOTO = { width: 4000, height: 3000 };

describe("searchTargetSize", () => {
  it.each([20, 50, 100, 200])("gets a phone photo under %i KB", async (kb) => {
    const target = kb * BYTES_PER_KB;
    const r = (await searchTargetSize(PHOTO, target, fakeEncoder()))!;
    expect(r.blob.size).toBeLessThanOrEqual(target);
    // Lands close to the limit rather than wastefully far below it.
    expect(r.blob.size).toBeGreaterThan(target * 0.8);
  });

  it("keeps the aspect ratio and never upscales when shrinking", async () => {
    const r = (await searchTargetSize(PHOTO, 50 * BYTES_PER_KB, fakeEncoder()))!;
    expect(r.width).toBeLessThan(PHOTO.width);
    expect(r.width / r.height).toBeCloseTo(4 / 3, 1);
  });

  it("keeps full size and only lowers quality when that's enough", async () => {
    const small = { width: 600, height: 400 }; // 240k px → 27 KB at q0.4, 113 KB at q0.92
    const r = (await searchTargetSize(small, 60 * BYTES_PER_KB, fakeEncoder()))!;
    expect([r.width, r.height]).toEqual([600, 400]);
    expect(r.quality).toBeGreaterThan(MIN_QUALITY);
    expect(r.quality).toBeLessThan(0.92);
    expect(r.blob.size).toBeLessThanOrEqual(60_000);
  });

  it("uses top quality at full size if the target is easy", async () => {
    const enc = fakeEncoder();
    const r = (await searchTargetSize({ width: 200, height: 200 }, 500 * BYTES_PER_KB, enc))!;
    expect(r.quality).toBe(0.92);
    expect([r.width, r.height]).toEqual([200, 200]);
    expect(enc).toHaveBeenCalledTimes(2); // min-quality probe + max-quality check
  });

  it("never drops quality below the floor (shrinks instead)", async () => {
    const enc = fakeEncoder();
    await searchTargetSize(PHOTO, 30 * BYTES_PER_KB, enc);
    for (const [, q] of enc.mock.calls) expect(q).toBeGreaterThanOrEqual(MIN_QUALITY);
  });

  it("returns null for an impossible target instead of a tiny unusable image", async () => {
    // At MIN_SIDE×MIN_SIDE and q0.4 the fake is ~530 bytes; 0.2 KB can't be met.
    const r = await searchTargetSize(PHOTO, 0.2 * BYTES_PER_KB, fakeEncoder());
    expect(r).toBeNull();
  });

  it("does a bounded amount of work", async () => {
    const enc = fakeEncoder();
    await searchTargetSize(PHOTO, 20 * BYTES_PER_KB, enc);
    expect(enc.mock.calls.length).toBeLessThanOrEqual(20);
  });

  it("rejects bad input", async () => {
    expect(await searchTargetSize(PHOTO, 0, fakeEncoder())).toBeNull();
    expect(await searchTargetSize({ width: 0, height: 10 }, 50_000, fakeEncoder())).toBeNull();
  });

  it("never shrinks the longest side below the minimum", async () => {
    const enc = fakeEncoder();
    await searchTargetSize(PHOTO, 1 * BYTES_PER_KB, enc);
    for (const [d] of enc.mock.calls) expect(Math.max(d.width, d.height)).toBeGreaterThanOrEqual(MIN_SIDE);
  });
});

describe("targetFileName", () => {
  it("names the output after the target and forces .jpg", () => {
    expect(targetFileName("passport photo.png", 50)).toBe("passport photo-50kb.jpg");
    expect(targetFileName("noext", 20)).toBe("noext-20kb.jpg");
  });
});
