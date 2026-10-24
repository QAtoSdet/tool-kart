import Link from "next/link";
import { SITE } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Site-relative path; omit for the current (last) page. */
  href?: string;
}

/**
 * Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. Breadcrumbs
 * help both users and search engines understand site structure, and can show up
 * as rich results under the page title.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const base = SITE.url.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${base}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-1.5">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="hover:text-slate-900 hover:underline dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "text-slate-700 dark:text-slate-200" : ""}>
                    {item.name}
                  </span>
                )}
                {!last ? <span aria-hidden>/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
