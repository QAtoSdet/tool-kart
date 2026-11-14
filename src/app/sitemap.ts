import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllRoutes } from "@/lib/routes";
import { getToolBySlug } from "@/lib/tools";
import { getGuideBySlug } from "@/lib/guides";
import { getHubBySlug } from "@/lib/categories";
import { getExamBySlug } from "@/lib/exams";
import { findHindiPage, languageAlternates } from "@/lib/hindi";

/**
 * Sitemap generated from the central route list, which is derived from the tool,
 * guide and category-hub registries. Adding any of them automatically adds it here
 * — no manual edits needed.
 *
 * Each entry's <lastmod> comes from its registry `lastModified` field, so Google
 * sees a meaningful per-page date instead of the build timestamp. Static pages
 * use a fixed date since they rarely change.
 *
 * Pages that exist in English and Hindi carry hreflang alternates on both entries.
 */
const STATIC_LASTMOD = "2026-11-09";

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");

  const entryFor = (path: string): Entry => {
    if (path.startsWith("/hi/")) {
      return {
        url: `${base}${path}`,
        lastModified: findHindiPage(path)?.lastModified ?? STATIC_LASTMOD,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }
    if (path.startsWith("/tools/")) {
      const slug = path.replace("/tools/", "");
      const tool = getToolBySlug(slug);
      return {
        url: `${base}${path}`,
        lastModified: tool?.lastModified ?? STATIC_LASTMOD,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }
    if (path.startsWith("/guides/")) {
      const slug = path.replace("/guides/", "");
      const guide = getGuideBySlug(slug);
      return {
        url: `${base}${path}`,
        lastModified: guide?.lastModified ?? STATIC_LASTMOD,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }
    if (path.startsWith("/exams/")) {
      const exam = getExamBySlug(path.replace("/exams/", ""));
      return {
        url: `${base}${path}`,
        lastModified: exam?.lastChecked ?? STATIC_LASTMOD,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }
    // Category hub pages (single-segment paths like "/finance-calculators").
    const hub = getHubBySlug(path.slice(1));
    if (hub) {
      return {
        url: `${base}${path}`,
        lastModified: hub.lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }
    const isHome = path === "/";
    const isGuidesIndex = path === "/guides" || path === "/exams";
    return {
      url: `${base}${path === "/" ? "" : path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: (isHome || isGuidesIndex ? "monthly" : "yearly") as "monthly" | "yearly",
      priority: isHome ? 1 : isGuidesIndex ? 0.6 : 0.4,
    };
  };

  return getAllRoutes().map((path) => {
    const entry = entryFor(path);
    const langs = languageAlternates(path);
    if (!langs) return entry;
    return {
      ...entry,
      alternates: {
        languages: Object.fromEntries(Object.entries(langs).map(([lang, p]) => [lang, `${base}${p}`])),
      },
    };
  });
}
