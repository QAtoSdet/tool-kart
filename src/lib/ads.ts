/**
 * Ad + analytics configuration, read from public env vars.
 *
 * Ads stay OFF until NEXT_PUBLIC_ADS_ENABLED === "true" AND a client ID is set,
 * so the site renders no ad markup before AdSense approval. Flipping the env
 * vars in the Vercel dashboard turns ads on with no code changes.
 */

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** True only when ads should actually render (flag on + client configured). */
export function adsActive(): boolean {
  return ADS_ENABLED && ADSENSE_CLIENT.length > 0;
}

/**
 * AdSense ad-unit slot IDs, keyed by our logical slot names. Fill these in with
 * the numeric slot IDs from your AdSense account after you create ad units.
 * Leaving a value empty means that slot renders responsive auto-ads markup.
 */
export const AD_UNIT_IDS: Record<string, string> = {
  "tool-top": process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP ?? "",
  "tool-bottom": process.env.NEXT_PUBLIC_AD_SLOT_TOOL_BOTTOM ?? "",
};
