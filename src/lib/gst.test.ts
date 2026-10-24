import { describe, it, expect } from "vitest";
import { calculateGst } from "./gst";

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
