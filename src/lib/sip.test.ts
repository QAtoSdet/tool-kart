import { describe, it, expect } from "vitest";
import { calculateSip, formatINR } from "./sip";

describe("calculateSip", () => {
  it("computes invested amount correctly", () => {
    const r = calculateSip({ monthlyInvestment: 5000, annualRatePercent: 12, years: 10 });
    expect(r.investedAmount).toBe(5000 * 120);
  });

  it("future value exceeds invested when return is positive", () => {
    const r = calculateSip({ monthlyInvestment: 5000, annualRatePercent: 12, years: 10 });
    expect(r.futureValue).toBeGreaterThan(r.investedAmount);
    expect(r.estimatedReturns).toBeCloseTo(r.futureValue - r.investedAmount, 2);
  });

  it("future value equals invested at 0% return", () => {
    const r = calculateSip({ monthlyInvestment: 1000, annualRatePercent: 0, years: 2 });
    expect(r.futureValue).toBeCloseTo(r.investedAmount, 2);
  });

  it("returns zeros for invalid input", () => {
    expect(calculateSip({ monthlyInvestment: 0, annualRatePercent: 10, years: 5 }).futureValue).toBe(0);
  });
});

describe("formatINR", () => {
  it("uses Indian grouping", () => {
    expect(formatINR(1234567)).toContain("12,34,567");
  });
});
