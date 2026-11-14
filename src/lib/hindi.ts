/**
 * Hindi versions of existing pages. Each Hindi page lives at `/hi<englishPath>` and is linked to
 * its English page with hreflang (in both pages' <head> and in the sitemap), so Google can show
 * the right language to each searcher instead of treating them as duplicates.
 *
 * Adding a Hindi page: add an entry here and create the route under src/app/hi/. Metadata,
 * sitemap and routes pick it up automatically.
 */

export interface HindiPage {
  /** Path of the English original, e.g. "/tools/percentage-calculator". */
  enPath: string;
  /** ISO date the Hindi page was last changed (sitemap <lastmod>). */
  lastModified: string;
}

export const HINDI_PAGES: HindiPage[] = [{ enPath: "/tools/percentage-calculator", lastModified: "2026-11-14" }];

export const hindiPath = (enPath: string) => `/hi${enPath}`;

export function getHindiRoutes(): string[] {
  return HINDI_PAGES.map((p) => hindiPath(p.enPath));
}

/** The Hindi page for an English path, or for a Hindi path itself. */
export function findHindiPage(path: string): HindiPage | undefined {
  const en = path.startsWith("/hi/") ? path.slice(3) : path;
  return HINDI_PAGES.find((p) => p.enPath === en);
}

/**
 * hreflang alternates (site-relative) for a page that has both languages, else undefined.
 * English is also the x-default for searchers in any other language.
 */
export function languageAlternates(path: string): Record<string, string> | undefined {
  const page = findHindiPage(path);
  if (!page) return undefined;
  return { en: page.enPath, hi: hindiPath(page.enPath), "x-default": page.enPath };
}
