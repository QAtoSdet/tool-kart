import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllRoutes } from "@/lib/routes";
import { getToolBySlug } from "@/lib/tools";

/**
 * Sitemap generated from the central route list, which is derived from the tool
 * registry. Adding a tool automatically adds it here — no manual edits needed.
 *
 * Each tool's <lastmod> comes from its `lastModified` field in the registry, so
 * Google sees a meaningful per-page date instead of the build timestamp. Static
 * pages use a fixed date since they rarely change.
 */
const STATIC_LASTMOD = "2026-10-01";

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
    return {
      url: `${base}${path === "/" ? "" : path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: (path === "/" ? "monthly" : "yearly") as "monthly" | "yearly",
      priority: path === "/" ? 1 : 0.4,
    };
  });
}
