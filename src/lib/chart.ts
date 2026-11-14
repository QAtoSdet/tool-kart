/**
 * Small, dependency-free helpers for the hand-drawn charts (no chart library, to keep pages light).
 */

/**
 * Round up to a tidy axis maximum (e.g. 11.6L → 12L, 87K → 1L). Steps are fine-grained enough
 * that the data always fills most of the chart, and each one halves to a tidy midpoint label.
 */
const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8];
export function niceCeil(value: number): number {
  if (!(value > 0) || !Number.isFinite(value)) return 1;
  const base = 10 ** Math.floor(Math.log10(value));
  for (const m of NICE_STEPS) if (value <= m * base * (1 + 1e-9)) return m * base;
  return 10 * base;
}

/**
 * Indices of at most `max` evenly spaced axis labels, always including the first and last item,
 * so a 30-year loan shows ~6 year labels rather than 30 overlapping ones.
 */
export function labelIndices(count: number, max: number): number[] {
  if (count <= 0) return [];
  if (count <= max || max < 2) return Array.from({ length: Math.min(count, Math.max(max, 1)) }, (_, i) => i);
  const step = Math.ceil((count - 1) / (max - 1));
  const out: number[] = [];
  for (let i = 0; i < count - 1; i += step) out.push(i);
  // Avoid a cramped penultimate label right next to the final one (e.g. Y9 beside Y10).
  if (count - 1 - out[out.length - 1] <= step / 2) out.pop();
  out.push(count - 1);
  return out;
}

const oneDecimal = (n: number) => String(Math.round(n * 10) / 10);

/** Compact rupees for axis labels using Indian units: ₹950, ₹50K, ₹2.5L, ₹1.2Cr. */
export function compactINR(amount: number): string {
  const a = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (a >= 1e7) return `${sign}₹${oneDecimal(a / 1e7)}Cr`;
  if (a >= 1e5) return `${sign}₹${oneDecimal(a / 1e5)}L`;
  if (a >= 1e3) return `${sign}₹${oneDecimal(a / 1e3)}K`;
  return `${sign}₹${Math.round(a)}`;
}

/** Whole-number percentage of `part` in `total` (0 when total is 0). */
export function percentOf(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}
