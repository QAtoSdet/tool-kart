import Link from "next/link";
import { getAvailableTools } from "@/lib/tools";

/**
 * Cross-tool discovery strip shown at the end of every tool page. Lists the
 * other available tools so a visitor who finished one tool is invited to the
 * next — this drives pageviews-per-visit (ad revenue) and provides internal
 * links (SEO). Excludes the tool the user is currently on.
 */
export function MoreTools({ currentSlug }: { currentSlug: string }) {
  const others = getAvailableTools().filter((t) => t.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section aria-labelledby="more-tools-heading" className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
      <h2 id="more-tools-heading" className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Try another free tool
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
          >
            <span aria-hidden className="text-xl">
              {tool.icon}
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                {tool.name}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                {tool.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
