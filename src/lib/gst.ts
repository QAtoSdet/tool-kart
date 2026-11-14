/**
 * GST (Goods & Services Tax) math — pure and unit-tested.
 *
 * Supports both directions:
 *  - "add": amount is the base (exclusive) price; add GST on top.
 *  - "remove": amount is the gross (inclusive) price; extract the base + GST.
 */

export type GstMode = "add" | "remove";

export interface GstInput {
  amount: number;
  ratePercent: number;
  mode: GstMode;
}

export interface GstResult {
  base: number;
  gst: number;
  total: number;
  /** CGST and SGST are each half of the GST (intra-state split). */
  cgst: number;
  sgst: number;
}

export function calculateGst({ amount, ratePercent, mode }: GstInput): GstResult {
  if (amount <= 0 || ratePercent < 0) {
    return { base: 0, gst: 0, total: 0, cgst: 0, sgst: 0 };
  }

  let base: number;
  let total: number;

  if (mode === "add") {
    base = amount;
    total = amount * (1 + ratePercent / 100);
  } else {
    // amount is inclusive of GST; back out the base.
    base = amount / (1 + ratePercent / 100);
    total = amount;
  }

  const gst = total - base;
  return {
    base,
    gst,
    total,
    cgst: gst / 2,
    sgst: gst / 2,
  };
}

/**
 * Current rates since GST 2.0 (56th GST Council, effective 22 September 2025): slabs of 0%, 5%,
 * 18% and 40%, plus the special 3% rate on gold and other precious metals. Source: PIB releases
 * of September 2025.
 */
export const GST_RATES = [0, 3, 5, 18, 40];

/** Slabs abolished on 22 September 2025, kept only for checking older bills. */
export const OLD_GST_RATES = [12, 28];

/** Date the current slabs took effect (ISO). */
export const GST_RATES_FROM = "2025-09-22";
