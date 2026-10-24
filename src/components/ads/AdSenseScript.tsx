import Script from "next/script";
import { adsActive, ADSENSE_CLIENT } from "@/lib/ads";

/**
 * Loads the Google AdSense library once, site-wide, but only when ads are active
 * (env flag on + client ID set). Rendered from the root layout. Before approval
 * this returns null, so no AdSense request is made at all.
 */
export function AdSenseScript() {
  if (!adsActive()) return null;
  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
