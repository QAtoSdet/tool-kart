/**
 * Percentage calculations — pure and unit-tested. Three common scenarios.
 */

/** What is X% of Y?  e.g. 15% of 200 = 30 */
export function percentOf(percent: number, value: number): number {
  return (percent / 100) * value;
}

/** X is what percent of Y?  e.g. 30 is what % of 200 = 15 */
export function whatPercent(x: number, y: number): number | null {
  if (y === 0) return null;
  return (x / y) * 100;
}

/** Percentage increase/decrease from old to new.  e.g. 200 -> 250 = +25% */
export function percentChange(oldValue: number, newValue: number): number | null {
  if (oldValue === 0) return null;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/** Trim to a readable number of decimals without trailing zeros. */
export function trim(value: number): string {
  if (!Number.isFinite(value)) return "";
  return String(Number(value.toFixed(4)));
}
