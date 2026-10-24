import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllRoutes } from "@/lib/routes";

/**
 * Sitemap generated from the central route list, which is derived from the tool
 * registry. Adding a tool automatically adds it here — no manual edits needed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  return getAllRoutes().map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/tools/") ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.8 : 0.4,
  }));
}
