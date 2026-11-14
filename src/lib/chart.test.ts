import { describe, it, expect } from "vitest";
import { compactINR, labelIndices, niceCeil, percentOf } from "./chart";

describe("niceCeil", () => {
  it.each([
    [87_000, 1_00_000],
    [1_00_000, 1_00_000],
    [1_20_000, 1_20_000],
    [1_48_700, 1_50_000], // EMI yearly payments for the default loan
    [2_10_000, 2_50_000],
    [3_10_000, 4_00_000],
    [6_00_000, 6_00_000],
    [11_61_695, 12_00_000], // SIP default total value
    [0.3, 0.3],
  ])("%d → %d", (v, expected) => expect(niceCeil(v)).toBeCloseTo(expected, 6));

  it("never leaves more than about a third of the chart empty", () => {
    for (let v = 1_000; v < 1e8; v *= 1.07) {
      const top = niceCeil(v);
      expect(top).toBeGreaterThanOrEqual(v);
      expect(v / top).toBeGreaterThan(0.62);
    }
  });

  it("handles zero, negatives and non-finite input", () => {
    expect(niceCeil(0)).toBe(1);
    expect(niceCeil(-5)).toBe(1);
    expect(niceCeil(Infinity)).toBe(1);
  });
});

describe("labelIndices", () => {
  it("shows every label when they fit", () => {
    expect(labelIndices(5, 6)).toEqual([0, 1, 2, 3, 4]);
  });

  it("thins long series but keeps the first and last", () => {
    const idx = labelIndices(30, 6);
    expect(idx[0]).toBe(0);
    expect(idx[idx.length - 1]).toBe(29);
    expect(idx.length).toBeLessThanOrEqual(6);
  });

  it("never crams the last label next to the one before it", () => {
    for (let n = 7; n <= 40; n++) {
      const idx = labelIndices(n, 6);
      expect(idx.length).toBeLessThanOrEqual(6);
      const gaps = idx.slice(1).map((v, i) => v - idx[i]);
      // Strictly more than half the widest gap: rules out e.g. Y9 beside Y10 when others are 2 apart.
      expect(Math.min(...gaps), `n=${n}: ${idx.join(",")}`).toBeGreaterThan(Math.max(...gaps) / 2);
    }
  });

  it("labels a 10-year loan Y1, Y3, Y5, Y7, Y10 rather than …Y9, Y10", () => {
    expect(labelIndices(10, 6)).toEqual([0, 2, 4, 6, 9]);
  });

  it("handles empty input", () => {
    expect(labelIndices(0, 6)).toEqual([]);
  });
});

describe("compactINR", () => {
  it.each([
    [950, "₹950"],
    [50_000, "₹50K"],
    [2_50_000, "₹2.5L"],
    [10_00_000, "₹10L"],
    [1_20_00_000, "₹1.2Cr"],
    [0, "₹0"],
    [-2_50_000, "-₹2.5L"],
  ])("%d → %s", (v, s) => expect(compactINR(v)).toBe(s));
});

describe("percentOf", () => {
  it("rounds and guards against a zero total", () => {
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(5, 0)).toBe(0);
  });
});
