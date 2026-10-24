import { getAvailableTools } from "@/lib/tools";

/** Static (non-tool) routes that should appear in the sitemap. */
export const STATIC_ROUTES = ["/", "/about", "/contact", "/privacy", "/terms"] as const;

/** All public routes (static + one per available tool), as site-relative paths. */
export function getAllRoutes(): string[] {
  const toolRoutes = getAvailableTools().map((t) => `/tools/${t.slug}`);
  return [...STATIC_ROUTES, ...toolRoutes];
}
