import Script from "next/script";
import { GA_ID } from "@/lib/ads";

/**
 * Google Analytics (gtag) loader. Loads only in production and only when a
 * measurement ID is configured, so local development and pre-launch builds send
 * no analytics traffic.
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      <Script
        id="ga-src"
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
