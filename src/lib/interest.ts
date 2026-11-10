/**
 * Simple and compound interest — pure, tested.
 *
 * Simple interest:   SI = P × R × T / 100
 * Compound interest: A  = P × (1 + R / (100 × n))^(n × T),  CI = A − P
 *   P = principal, R = annual rate (%), T = time in years, n = compounding periods per year.
 *
 * For a tenure that isn't a whole number of compounding periods (e.g. 1 year 1 month, quarterly)
 * the exponent is fractional. Banks may treat the stub period differently, so results for such
 * tenures are close estimates — the UI says so.
 */

export type Compounding = "yearly" | "half-yearly" | "quarterly" | "monthly";

export const COMPOUNDING_PERIODS: Record<Compounding, number> = {
  yearly: 1,
  "half-yearly": 2,
  quarterly: 4,
  monthly: 12,
};

export interface InterestResult {
  interest: number;
  total: number;
}

export function simpleInterest(principal: number, ratePercent: number, years: number): InterestResult {
  const interest = (principal * ratePercent * years) / 100;
  return { interest, total: principal + interest };
}

export function compoundInterest(
  principal: number,
  ratePercent: number,
  years: number,
  compounding: Compounding,
): InterestResult {
  const n = COMPOUNDING_PERIODS[compounding];
  const total = principal * Math.pow(1 + ratePercent / (100 * n), n * years);
  return { interest: total - principal, total };
}

export interface ScheduleRow {
  /** Elapsed time in years (whole years, plus a final fractional row if needed). */
  years: number;
  simpleTotal: number;
  compoundTotal: number;
}

/** Year-by-year balances under both methods, ending exactly at `years`. */
export function growthSchedule(
  principal: number,
  ratePercent: number,
  years: number,
  compounding: Compounding,
): ScheduleRow[] {
  const points: number[] = [];
  for (let y = 1; y <= Math.floor(years); y++) points.push(y);
  if (years % 1 !== 0) points.push(years);
  return points.map((t) => ({
    years: t,
    simpleTotal: simpleInterest(principal, ratePercent, t).total,
    compoundTotal: compoundInterest(principal, ratePercent, t, compounding).total,
  }));
}

export const MAX_YEARS = 50;

export interface InterestInput {
  principal: number;
  ratePercent: number;
  years: number;
  months: number;
}

/** Validate inputs; returns an error message, or null if valid. */
export function validateInterestInput({ principal, ratePercent, years, months }: InterestInput): string | null {
  if (!Number.isFinite(principal) || principal <= 0) return "Enter a principal amount greater than 0.";
  if (!Number.isFinite(ratePercent) || ratePercent < 0 || ratePercent > 100) {
    return "Enter an interest rate between 0 and 100%.";
  }
  if (!Number.isInteger(years) || years < 0 || !Number.isInteger(months) || months < 0 || months > 11) {
    return "Enter whole years and 0–11 months.";
  }
  const total = years + months / 12;
  if (total <= 0) return "Enter a time period greater than 0.";
  if (total > MAX_YEARS) return `Enter a time period of up to ${MAX_YEARS} years.`;
  return null;
}
