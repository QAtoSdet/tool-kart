import { describe, it, expect } from "vitest";
import { calculateGst, GST_RATES, OLD_GST_RATES } from "./gst";

describe("GST rates", () => {
  // GST 2.0, effective 22 September 2025 (56th GST Council; PIB releases of September 2025).
  // Only change these after a new official notification.
  it("offers the current slabs (0, 5, 18, 40) plus 3% on gold", () => {
    expect(GST_RATES).toEqual([0, 3, 5, 18, 40]);
  });
  it("keeps the abolished 12% and 28% only as old rates", () => {
    expect(OLD_GST_RATES).toEqual([12, 28]);
    for (const r of OLD_GST_RATES) expect(GST_RATES).not.toContain(r);
  });
});

describe("calculateGst", () => {
  it("adds GST on an exclusive amount", () => {
    const r = calculateGst({ amount: 1000, ratePercent: 18, mode: "add" });
    expect(r.base).toBeCloseTo(1000, 2);
    expect(r.gst).toBeCloseTo(180, 2);
    expect(r.total).toBeCloseTo(1180, 2);
    expect(r.cgst).toBeCloseTo(90, 2);
    expect(r.sgst).toBeCloseTo(90, 2);
  });

  it("removes GST from an inclusive amount", () => {
    const r = calculateGst({ amount: 1180, ratePercent: 18, mode: "remove" });
    expect(r.base).toBeCloseTo(1000, 2);
    expect(r.gst).toBeCloseTo(180, 2);
    expect(r.total).toBeCloseTo(1180, 2);
  });

  it("returns zeros for invalid input", () => {
    expect(calculateGst({ amount: 0, ratePercent: 18, mode: "add" }).total).toBe(0);
  });
});
