import { getAvailableTools } from "@/lib/tools";
import { getAvailableGuides } from "@/lib/guides";
import { getHubRoutes } from "@/lib/categories";

/** Static (non-tool/non-guide/non-hub) routes that should appear in the sitemap. */
export const STATIC_ROUTES = ["/", "/guides", "/about", "/contact", "/privacy", "/terms"] as const;

/** All public routes (static + tools + guides + category hubs), as site-relative paths. */
export function getAllRoutes(): string[] {
  const toolRoutes = getAvailableTools().map((t) => `/tools/${t.slug}`);
  const guideRoutes = getAvailableGuides().map((g) => `/guides/${g.slug}`);
  const hubRoutes = getHubRoutes();
  return [...STATIC_ROUTES, ...toolRoutes, ...guideRoutes, ...hubRoutes];
}
