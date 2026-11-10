/** Site-wide constants used in metadata, header, footer, etc. */
export const SITE = {
  name: "Tool Kart",
  tagline: "Free online tools, no sign-up",
  /** Canonical base URL; overridden by NEXT_PUBLIC_SITE_URL in production. */
  // Fallback is the www host because that's the live canonical (non-www 308-redirects to it).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tool-kart.com",
  description:
    "Free online utility tools that run in your browser: image compressor, QR code generator, income tax, age, EMI, GST, SIP and percentage calculators, unit converter, word counter and password generator. No sign-up, no uploads.",
  /** Contact email shown on the Contact/Privacy pages. */
  contactEmail: "toolkart.help@gmail.com",
} as const;
