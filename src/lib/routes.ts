import { getAvailableTools } from "@/lib/tools";
import { getAvailableGuides } from "@/lib/guides";
import { getHubRoutes } from "@/lib/categories";
import { getExamRoutes } from "@/lib/exams";
import { getHindiRoutes } from "@/lib/hindi";

/** Static (non-tool/non-guide/non-hub/non-exam) routes that should appear in the sitemap. */
export const STATIC_ROUTES = ["/", "/guides", "/exams", "/about", "/contact", "/privacy", "/terms"] as const;

/**
 * All public routes (static + tools + guides + category hubs + exam pages + Hindi pages), as
 * site-relative paths.
 */
export function getAllRoutes(): string[] {
  const toolRoutes = getAvailableTools().map((t) => `/tools/${t.slug}`);
  const guideRoutes = getAvailableGuides().map((g) => `/guides/${g.slug}`);
  return [
    ...STATIC_ROUTES,
    ...toolRoutes,
    ...guideRoutes,
    ...getHubRoutes(),
    ...getExamRoutes(),
    ...getHindiRoutes(),
  ];
}
