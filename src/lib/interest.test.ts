import { describe, it, expect } from "vitest";
import {
  compoundInterest,
  growthSchedule,
  simpleInterest,
  validateInterestInput,
} from "./interest";

const r2 = (n: number) => Math.round(n * 100) / 100;

describe("simple interest", () => {
  it("SI = P × R × T / 100", () => {
    expect(simpleInterest(1_00_000, 10, 2)).toEqual({ interest: 20_000, total: 1_20_000 });
    expect(simpleInterest(5_000, 8, 1.5).interest).toBe(600);
  });

  it("is zero at 0%", () => {
    expect(simpleInterest(10_000, 0, 5).interest).toBe(0);
  });
});

describe("compound interest", () => {
  // Textbook values that can be checked by hand.
  it("yearly: ₹1,00,000 at 10% for 2 years → ₹21,000 interest", () => {
    expect(r2(compoundInterest(1_00_000, 10, 2, "yearly").interest)).toBe(21_000);
  });

  it("half-yearly: ₹10,000 at 10% for 2 years → ₹12,155.06", () => {
    expect(r2(compoundInterest(10_000, 10, 2, "half-yearly").total)).toBe(12_155.06);
  });

  it("monthly: ₹1,00,000 at 12% for 1 year → ₹1,12,682.50", () => {
    expect(r2(compoundInterest(1_00_000, 12, 1, "monthly").total)).toBe(1_12_682.5);
  });

  it("more frequent compounding earns more", () => {
    const f = (c: Parameters<typeof compoundInterest>[3]) => compoundInterest(1_00_000, 8, 5, c).total;
    expect(f("yearly")).toBeLessThan(f("half-yearly"));
    expect(f("half-yearly")).toBeLessThan(f("quarterly"));
    expect(f("quarterly")).toBeLessThan(f("monthly"));
  });

  it("equals simple interest for exactly one yearly period", () => {
    expect(compoundInterest(50_000, 9, 1, "yearly").interest).toBeCloseTo(simpleInterest(50_000, 9, 1).interest, 6);
  });

  it("is zero at 0%", () => {
    expect(compoundInterest(10_000, 0, 5, "monthly").interest).toBe(0);
  });
});

// Figures quoted in the "simple vs compound interest" guide — keep the article and maths in sync.
describe("guide examples (₹1,00,000 at 7% for 5 years)", () => {
  it("SI ₹35,000; yearly CI ₹1,40,255; quarterly CI ₹1,41,478", () => {
    expect(Math.round(simpleInterest(1_00_000, 7, 5).total)).toBe(1_35_000);
    expect(Math.round(compoundInterest(1_00_000, 7, 5, "yearly").total)).toBe(1_40_255);
    expect(Math.round(compoundInterest(1_00_000, 7, 5, "quarterly").total)).toBe(1_41_478);
  });

  it("over 20 years the gap widens: SI ₹2,40,000 vs yearly CI ₹3,86,968", () => {
    expect(Math.round(simpleInterest(1_00_000, 7, 20).total)).toBe(2_40_000);
    expect(Math.round(compoundInterest(1_00_000, 7, 20, "yearly").total)).toBe(3_86_968);
  });

  it("7% compounded quarterly is an effective ~7.19% a year (guide FAQ)", () => {
    const effective = compoundInterest(100, 7, 1, "quarterly").interest;
    expect(Math.round(effective * 100) / 100).toBe(7.19);
  });

  it("rule of 72: money roughly doubles in ~10.3 years at 7%", () => {
    // Exact doubling time with yearly compounding is ln 2 / ln 1.07 ≈ 10.24 years.
    expect(Math.log(2) / Math.log(1.07)).toBeCloseTo(10.24, 2);
    expect(72 / 7).toBeCloseTo(10.29, 2);
  });
});

describe("growth schedule", () => {
  it("has one row per whole year", () => {
    const s = growthSchedule(1_00_000, 10, 3, "yearly");
    expect(s.map((r) => r.years)).toEqual([1, 2, 3]);
    expect(r2(s[1].compoundTotal)).toBe(1_21_000);
    expect(s[2].simpleTotal).toBe(1_30_000);
  });

  it("adds a final row for a part year", () => {
    const s = growthSchedule(1_00_000, 10, 2.5, "yearly");
    expect(s.map((r) => r.years)).toEqual([1, 2, 2.5]);
  });

  it("has just the part-year row for tenures under a year", () => {
    expect(growthSchedule(1_00_000, 10, 0.5, "monthly").map((r) => r.years)).toEqual([0.5]);
  });
});

describe("validation", () => {
  const ok = { principal: 1000, ratePercent: 7, years: 1, months: 0 };
  it("accepts valid input", () => expect(validateInterestInput(ok)).toBeNull());
  it.each([
    [{ ...ok, principal: 0 }, /principal/],
    [{ ...ok, ratePercent: -1 }, /rate/],
    [{ ...ok, ratePercent: 101 }, /rate/],
    [{ ...ok, years: 0, months: 0 }, /greater than 0/],
    [{ ...ok, months: 12 }, /0–11 months/],
    [{ ...ok, years: 1.5 }, /whole years/],
    [{ ...ok, years: 51 }, /up to 50/],
  ])("rejects %o", (input, msg) => {
    expect(validateInterestInput(input)).toMatch(msg);
  });
});
