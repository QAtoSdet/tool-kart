/** Site-wide constants used in metadata, header, footer, etc. */
export const SITE = {
  name: "Tool Kart",
  tagline: "Free online tools, no sign-up",
  /** Canonical base URL; overridden by NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tool-kart.com",
  description:
    "Free online utility tools that run in your browser: image compressor, QR code generator, age, EMI, GST, SIP and percentage calculators, unit converter, word counter and password generator. No sign-up, no uploads.",
  /**
   * Contact email shown on the Contact/Privacy pages.
   * IMPORTANT: replace this with a real inbox you can read (e.g. your Gmail).
   * AdSense and users expect a working address.
   */
  contactEmail: "YOUR_EMAIL@gmail.com",
} as const;
