import { getAvailableTools } from "@/lib/tools";
import { getAvailableGuides } from "@/lib/guides";

/** Static (non-tool/non-guide) routes that should appear in the sitemap. */
export const STATIC_ROUTES = ["/", "/guides", "/about", "/contact", "/privacy", "/terms"] as const;

/** All public routes (static + tools + guides), as site-relative paths. */
export function getAllRoutes(): string[] {
  const toolRoutes = getAvailableTools().map((t) => `/tools/${t.slug}`);
  const guideRoutes = getAvailableGuides().map((g) => `/guides/${g.slug}`);
  return [...STATIC_ROUTES, ...toolRoutes, ...guideRoutes];
}
