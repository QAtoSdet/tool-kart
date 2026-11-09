import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllRoutes } from "@/lib/routes";
import { getToolBySlug } from "@/lib/tools";
import { getGuideBySlug } from "@/lib/guides";

/**
 * Sitemap generated from the central route list, which is derived from the tool
 * and guide registries. Adding a tool or guide automatically adds it here — no
 * manual edits needed.
 *
 * Each entry's <lastmod> comes from its registry `lastModified` field, so
 * Google sees a meaningful per-page date instead of the build timestamp. Static
 * pages use a fixed date since they rarely change.
 */
const STATIC_LASTMOD = "2026-11-09";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");

  return getAllRoutes().map((path) => {
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
    const isHome = path === "/";
    const isHub = path === "/guides";
    return {
      url: `${base}${path === "/" ? "" : path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: (isHome || isHub ? "monthly" : "yearly") as "monthly" | "yearly",
      priority: isHome ? 1 : isHub ? 0.6 : 0.4,
    };
  });
}
