/**
 * Indian personal income-tax estimate for FY 2026-27 (Tax Year 2026-27), old vs new regime.
 *
 * Budget 2026 left the slabs, rebate and standard deduction unchanged from FY 2025-26, so the
 * rules below apply to both years. Pure and framework-free so it can be unit-tested directly.
 *
 * New regime (default): 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%, 16–20L 20%, 20–24L 25%,
 *   above 24L 30%. Standard deduction ₹75,000 (salaried). Sec 87A rebate up to ₹60,000 when
 *   taxable income ≤ ₹12L, with marginal relief just above ₹12L. Surcharge capped at 25%.
 * Old regime: 0–2.5L nil (3L for 60–80, 5L for 80+), up to 5L 5%, 5–10L 20%, above 10L 30%.
 *   Standard deduction ₹50,000 (salaried). Sec 87A rebate up to ₹12,500 when taxable ≤ ₹5L.
 *   Surcharge goes up to 37% above ₹5 Cr.
 * Both: surcharge 10% above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr (with marginal relief at each
 *   threshold), then 4% health & education cess on tax + surcharge.
 *
 * Out of scope (stated in the UI): special-rate income such as capital gains, lottery or crypto,
 * and non-salary standard deductions.
 */

export type Regime = "new" | "old";
export type AgeGroup = "below60" | "60to80" | "above80";

interface Slab {
  /** Upper bound of the slab (inclusive); Infinity for the top slab. */
  upTo: number;
  rate: number;
}

const NEW_SLABS: Slab[] = [
  { upTo: 4_00_000, rate: 0 },
  { upTo: 8_00_000, rate: 0.05 },
  { upTo: 12_00_000, rate: 0.1 },
  { upTo: 16_00_000, rate: 0.15 },
  { upTo: 20_00_000, rate: 0.2 },
  { upTo: 24_00_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

function oldSlabs(age: AgeGroup): Slab[] {
  const exemption = age === "above80" ? 5_00_000 : age === "60to80" ? 3_00_000 : 2_50_000;
  const slabs: Slab[] = [{ upTo: exemption, rate: 0 }];
  if (exemption < 5_00_000) slabs.push({ upTo: 5_00_000, rate: 0.05 });
  slabs.push({ upTo: 10_00_000, rate: 0.2 }, { upTo: Infinity, rate: 0.3 });
  return slabs;
}

export const STANDARD_DEDUCTION: Record<Regime, number> = { new: 75_000, old: 50_000 };
const REBATE: Record<Regime, { limit: number; max: number }> = {
  new: { limit: 12_00_000, max: 60_000 },
  old: { limit: 5_00_000, max: 12_500 },
};
const CESS_RATE = 0.04;

/** Tax on `income` using progressive slabs (before rebate, surcharge and cess). */
export function slabTax(income: number, slabs: Slab[]): number {
  let tax = 0;
  let lower = 0;
  for (const { upTo, rate } of slabs) {
    if (income <= lower) break;
    tax += (Math.min(income, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

function surchargeBands(regime: Regime) {
  const bands = [
    { above: 50_00_000, rate: 0.1 },
    { above: 1_00_00_000, rate: 0.15 },
    { above: 2_00_00_000, rate: 0.25 },
  ];
  if (regime === "old") bands.push({ above: 5_00_00_000, rate: 0.37 });
  return bands;
}

/**
 * Surcharge on `tax` for `income`, with marginal relief: crossing a threshold must not raise
 * tax + surcharge by more than the income earned above that threshold.
 */
function surcharge(income: number, tax: number, regime: Regime, taxAt: (i: number) => number) {
  const bands = surchargeBands(regime);
  let idx = -1;
  for (let i = 0; i < bands.length; i++) if (income > bands[i].above) idx = i;
  if (idx === -1) return 0;

  const { above, rate } = bands[idx];
  const prevRate = idx > 0 ? bands[idx - 1].rate : 0;
  const full = tax * rate;
  const capTotal = taxAt(above) * (1 + prevRate) + (income - above);
  return Math.max(0, Math.min(full, capTotal - tax));
}

export interface TaxInput {
  /** Gross annual income (₹). */
  grossIncome: number;
  /** Apply the salaried standard deduction. */
  salaried: boolean;
  /** Affects the old-regime exemption limit only. */
  ageGroup: AgeGroup;
  /** Old-regime deductions/exemptions (80C, 80D, HRA, home-loan interest, …). Ignored by the new regime. */
  oldRegimeDeductions: number;
}

export interface RegimeResult {
  regime: Regime;
  taxableIncome: number;
  taxBeforeRebate: number;
  /** Section 87A rebate plus any marginal relief on the rebate. */
  rebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
}

export function calculateRegime(input: TaxInput, regime: Regime): RegimeResult {
  const gross = Math.max(0, input.grossIncome || 0);
  const stdDed = input.salaried ? STANDARD_DEDUCTION[regime] : 0;
  const otherDed = regime === "old" ? Math.max(0, input.oldRegimeDeductions || 0) : 0;
  const taxableIncome = Math.max(0, gross - stdDed - otherDed);

  const slabs = regime === "new" ? NEW_SLABS : oldSlabs(input.ageGroup);
  const taxBeforeRebate = slabTax(taxableIncome, slabs);

  // Section 87A rebate, plus marginal relief just above the new-regime limit.
  let afterRebate = taxBeforeRebate;
  const { limit, max } = REBATE[regime];
  if (taxableIncome <= limit) {
    afterRebate = Math.max(0, taxBeforeRebate - max);
  } else if (regime === "new") {
    afterRebate = Math.min(taxBeforeRebate, taxableIncome - limit);
  }
  const rebate = taxBeforeRebate - afterRebate;

  const sc = surcharge(taxableIncome, afterRebate, regime, (i) => slabTax(i, slabs));
  const cess = (afterRebate + sc) * CESS_RATE;
  const totalTax = Math.round(afterRebate + sc + cess);

  return {
    regime,
    taxableIncome,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate: Math.round(rebate),
    surcharge: Math.round(sc),
    cess: Math.round(cess),
    totalTax,
  };
}

export interface Comparison {
  newRegime: RegimeResult;
  oldRegime: RegimeResult;
  /** Regime with lower tax; "equal" if the same. */
  better: Regime | "equal";
  /** How much the better regime saves. */
  savings: number;
}

export function compareRegimes(input: TaxInput): Comparison {
  const newRegime = calculateRegime(input, "new");
  const oldRegime = calculateRegime(input, "old");
  const diff = oldRegime.totalTax - newRegime.totalTax;
  return {
    newRegime,
    oldRegime,
    better: diff === 0 ? "equal" : diff > 0 ? "new" : "old",
    savings: Math.abs(diff),
  };
}
