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

export const GST_RATES = [0, 3, 5, 12, 18, 28];
