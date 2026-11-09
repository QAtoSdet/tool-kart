import Link from "next/link";
import { getGuidesForTool } from "@/lib/guides";

/**
 * Related-guides strip shown on a tool page. Lists the guides that cluster with
 * this tool, so a visitor who used the tool is invited to the deeper
 * informational content — this drives pageviews-per-visit and provides the
 * internal link from tool → guide that completes the cluster.
 *
 * Renders nothing when the tool has no related guides yet, so it is safe to add
 * to `ToolPage` for every tool.
 */
export function RelatedGuides({ toolSlug }: { toolSlug: string }) {
  const guides = getGuidesForTool(toolSlug);
  if (guides.length === 0) return null;

  return (
    <section
      aria-labelledby="related-guides-heading"
      className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700"
    >
      <h2
        id="related-guides-heading"
        className="mb-4 text-lg font-semibold text-slate-900 dark:text-white"
      >
        Related guides
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group rounded-lg border border-slate-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
              {guide.title}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
              {guide.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
