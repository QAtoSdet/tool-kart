import { describe, it, expect } from "vitest";
import { calculateSip, formatINR, sipYearlySchedule } from "./sip";

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

describe("sipYearlySchedule", () => {
  const input = { monthlyInvestment: 5000, annualRatePercent: 12, years: 10 };

  it("has one point per year and ends at the headline result", () => {
    const s = sipYearlySchedule(input);
    expect(s.map((p) => p.years)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const final = calculateSip(input);
    expect(s[9].invested).toBe(final.investedAmount);
    expect(s[9].value).toBeCloseTo(final.futureValue, 6);
  });

  it("grows every year, with value above invested at a positive return", () => {
    const s = sipYearlySchedule(input);
    for (let i = 1; i < s.length; i++) expect(s[i].value).toBeGreaterThan(s[i - 1].value);
    expect(s.every((p) => p.value > p.invested)).toBe(true);
  });

  it("adds a final part-year point", () => {
    expect(sipYearlySchedule({ ...input, years: 2.5 }).map((p) => p.years)).toEqual([1, 2, 2.5]);
    expect(sipYearlySchedule({ ...input, years: 0.5 }).map((p) => p.years)).toEqual([0.5]);
  });

  it("is empty for invalid input", () => {
    expect(sipYearlySchedule({ ...input, monthlyInvestment: 0 })).toEqual([]);
    expect(sipYearlySchedule({ ...input, years: 0 })).toEqual([]);
  });
});
