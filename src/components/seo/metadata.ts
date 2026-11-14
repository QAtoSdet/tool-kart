import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { languageAlternates } from "@/lib/hindi";

export interface ToolMetaInput {
  /** Page title (without the site-name suffix; the layout template adds it). */
  title: string;
  /** Meta description (~150-160 chars ideal). */
  description: string;
  /** Path for this page, e.g. "/tools/emi-calculator". Used for canonical + OG url. */
  path: string;
  /** Optional keywords for the meta keywords tag. */
  keywords?: string[];
}

/**
 * Build a Next.js Metadata object for a tool (or any) page with a canonical URL
 * and Open Graph/Twitter tags derived from site config. The root layout's title
 * template appends the site name, so pass the bare page title here.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: ToolMetaInput): Metadata {
  const base = SITE.url.replace(/\/$/, "");
  const url = `${base}${path}`;
  // Pages with a Hindi (or English) counterpart get hreflang links to both versions.
  const langs = languageAlternates(path);
  const languages = langs
    ? Object.fromEntries(Object.entries(langs).map(([lang, p]) => [lang, `${base}${p}`]))
    : undefined;
  return {
    title,
    description,
    keywords,
    alternates: languages ? { canonical: url, languages } : { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: path.startsWith("/hi/") ? "hi_IN" : "en_IN",
      title: `${title} | ${SITE.name}`,
      description,
      url,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}
