import { describe, it, expect } from "vitest";
import { calculateRegime, compareRegimes, slabTax, type TaxInput } from "./income-tax";

// "Taxable income" helper: no standard deduction, no deductions, so gross == taxable.
const taxable = (income: number, ageGroup: TaxInput["ageGroup"] = "below60"): TaxInput => ({
  grossIncome: income,
  salaried: false,
  ageGroup,
  oldRegimeDeductions: 0,
});

describe("income tax — new regime (FY 2026-27)", () => {
  // Expected totals (incl. 4% cess) match published FY 2025-26/2026-27 worked figures.
  it.each([
    [8_00_000, 0],
    [12_00_000, 0],
    [13_00_000, 78_000],
    [15_00_000, 1_09_200],
    [20_00_000, 2_08_000],
    [25_00_000, 3_43_200],
    [30_00_000, 4_99_200],
  ])("taxable %i → total tax %i", (income, expected) => {
    expect(calculateRegime(taxable(income), "new").totalTax).toBe(expected);
  });

  it("applies the full ₹60,000 rebate at exactly ₹12 lakh", () => {
    const r = calculateRegime(taxable(12_00_000), "new");
    expect(r.taxBeforeRebate).toBe(60_000);
    expect(r.rebate).toBe(60_000);
  });

  it("gives marginal relief just above ₹12 lakh (₹12.1L → ₹10,400)", () => {
    // Slab tax ₹61,500 is capped at the ₹10,000 earned above ₹12L, plus 4% cess.
    expect(calculateRegime(taxable(12_10_000), "new").totalTax).toBe(10_400);
  });

  it("makes ₹12.75 lakh salary tax-free after the ₹75,000 standard deduction", () => {
    const r = calculateRegime(
      { grossIncome: 12_75_000, salaried: true, ageGroup: "below60", oldRegimeDeductions: 0 },
      "new",
    );
    expect(r.taxableIncome).toBe(12_00_000);
    expect(r.totalTax).toBe(0);
  });

  it("computes the ₹15 lakh salary example (₹97,500)", () => {
    const r = calculateRegime(
      { grossIncome: 15_00_000, salaried: true, ageGroup: "below60", oldRegimeDeductions: 0 },
      "new",
    );
    expect(r.taxableIncome).toBe(14_25_000);
    expect(r.totalTax).toBe(97_500);
  });

  it("ignores old-regime deductions", () => {
    const a = calculateRegime({ ...taxable(20_00_000), oldRegimeDeductions: 5_00_000 }, "new");
    expect(a.taxableIncome).toBe(20_00_000);
  });
});

describe("income tax — old regime", () => {
  it.each([
    [8_00_000, 75_400],
    [10_00_000, 1_17_000],
    [12_00_000, 1_79_400],
    [13_00_000, 2_10_600],
    [15_00_000, 2_73_000],
    [20_00_000, 4_29_000],
    [25_00_000, 5_85_000],
    [30_00_000, 7_41_000],
  ])("taxable %i → total tax %i", (income, expected) => {
    expect(calculateRegime(taxable(income), "old").totalTax).toBe(expected);
  });

  it("is tax-free up to ₹5 lakh through the ₹12,500 rebate", () => {
    expect(calculateRegime(taxable(5_00_000), "old").totalTax).toBe(0);
  });

  it("has no marginal relief just above ₹5 lakh", () => {
    // ₹5,10,000: 12,500 + 2,000 = 14,500 → +4% cess = 15,080.
    expect(calculateRegime(taxable(5_10_000), "old").totalTax).toBe(15_080);
  });

  it("uses higher exemption limits for senior and super-senior citizens", () => {
    // 60–80: 0–3L nil, 3–5L 5% (10,000), 5–10L 20% (1,00,000) → 1,10,000 × 1.04
    expect(calculateRegime(taxable(10_00_000, "60to80"), "old").totalTax).toBe(1_14_400);
    // 80+: 0–5L nil, 5–10L 20% (1,00,000) → × 1.04
    expect(calculateRegime(taxable(10_00_000, "above80"), "old").totalTax).toBe(1_04_000);
  });

  it("subtracts deductions and the ₹50,000 standard deduction (₹25L salary example)", () => {
    const r = calculateRegime(
      { grossIncome: 25_00_000, salaried: true, ageGroup: "below60", oldRegimeDeductions: 5_75_000 },
      "old",
    );
    expect(r.taxableIncome).toBe(18_75_000);
    expect(r.totalTax).toBe(3_90_000);
  });
});

describe("income tax — surcharge", () => {
  it("adds 10% surcharge above ₹50 lakh", () => {
    // New regime, ₹60L: slab tax 13,80,000; +10% = 15,18,000; +4% cess = 15,78,720.
    const r = calculateRegime(taxable(60_00_000), "new");
    expect(r.surcharge).toBe(1_38_000);
    expect(r.totalTax).toBe(15_78_720);
  });

  it("applies marginal relief just above ₹50 lakh", () => {
    // At ₹50L tax = 10,80,000. At ₹50.1L, tax+surcharge is capped at 10,80,000 + 10,000.
    const r = calculateRegime(taxable(50_10_000), "new");
    expect(r.surcharge).toBe(10_90_000 - 10_83_000);
    expect(r.totalTax).toBe(Math.round(10_90_000 * 1.04));
  });

  it("caps the new-regime surcharge at 25% but charges 37% in the old regime above ₹5 Cr", () => {
    const income = 6_00_00_000;
    const n = calculateRegime(taxable(income), "new");
    const o = calculateRegime(taxable(income), "old");
    expect(n.surcharge / (n.totalTax / 1.04 - n.surcharge)).toBeCloseTo(0.25, 5);
    expect(o.surcharge / (o.totalTax / 1.04 - o.surcharge)).toBeCloseTo(0.37, 5);
  });
});

describe("income tax — comparison and edge cases", () => {
  it("recommends the regime with lower tax and reports the saving", () => {
    const c = compareRegimes(taxable(13_00_000));
    expect(c.better).toBe("new");
    expect(c.savings).toBe(2_10_600 - 78_000);
  });

  it("favours the old regime when deductions are large", () => {
    const c = compareRegimes({
      grossIncome: 20_00_000,
      salaried: true,
      ageGroup: "below60",
      oldRegimeDeductions: 8_00_000,
    });
    // Old: 20L − 50k − 8L = 11.5L → 1,57,500 × 1.04 = 1,63,800.
    // New: 20L − 75k = 19.25L → 1,85,000 × 1.04 = 1,92,400.
    expect(c.oldRegime.totalTax).toBe(1_63_800);
    expect(c.newRegime.totalTax).toBe(1_92_400);
    expect(c.better).toBe("old");
    expect(c.savings).toBe(28_600);
  });

  // Figures quoted in the "old vs new tax regime" guide — keep the article and maths in sync.
  it("matches the guide's worked examples", () => {
    const salary = (gross: number, ded: number) =>
      compareRegimes({ grossIncome: gross, salaried: true, ageGroup: "below60", oldRegimeDeductions: ded });
    const ten = salary(10_00_000, 0);
    expect([ten.newRegime.totalTax, ten.oldRegime.totalTax]).toEqual([0, 1_06_600]);
    const fifteen = salary(15_00_000, 1_50_000);
    expect([fifteen.newRegime.totalTax, fifteen.oldRegime.totalTax]).toEqual([97_500, 2_10_600]);
    // Break-even at ₹20L salary is about ₹7.08L of deductions.
    expect(salary(20_00_000, 7_00_000).better).toBe("new");
    expect(salary(20_00_000, 7_10_000).better).toBe("old");
  });

  it("reports 'equal' when both regimes come to zero", () => {
    const c = compareRegimes({
      grossIncome: 10_00_000,
      salaried: true,
      ageGroup: "below60",
      oldRegimeDeductions: 5_00_000,
    });
    expect(c.better).toBe("equal");
    expect(c.savings).toBe(0);
  });

  it("handles zero and negative income", () => {
    expect(calculateRegime(taxable(0), "new").totalTax).toBe(0);
    expect(calculateRegime(taxable(-5), "old").totalTax).toBe(0);
  });

  it("slabTax is progressive", () => {
    expect(slabTax(5_00_000, [{ upTo: 2_50_000, rate: 0 }, { upTo: Infinity, rate: 0.1 }])).toBe(25_000);
  });
});
