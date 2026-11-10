import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getToolBySlug } from "@/lib/tools";
import { getAvailableGuides, type Guide } from "@/lib/guides";

export interface TocItem {
  /** Section title shown in the contents list. */
  text: string;
  /** Anchor href within the page, e.g. "#how-it-works". */
  href: string;
}

export interface ContentPageProps {
  /** Slug of the current guide (used to exclude it from the "more guides" strip). */
  slug: string;
  /** Guide title — rendered as the page H1. */
  title: string;
  /** One-line description shown under the title. */
  description: string;
  /** Tool slug this guide clusters with — renders a prominent "use the tool" callout. */
  relatedToolSlug: string;
  /** The article body: original, SEO-friendly prose with semantic headings. */
  children: React.ReactNode;
  /** FAQ entries, rendered as an accessible list and reused for JSON-LD by the page. */
  faqs?: FaqItem[];
  /** Optional table of contents; when provided a "On this page" nav is rendered. */
  toc?: TocItem[];
}

/**
 * Shared layout for every guide (content) page. Mirrors `ToolPage` so guides
 * feel native to the site: breadcrumbs, an H1, a prominent callout to the
 * related tool (the cluster link), an optional table of contents, the article
 * body, FAQs and a cross-linking "more guides" strip.
 */
export function ContentPage({
  slug,
  title,
  description,
  relatedToolSlug,
  children,
  faqs,
  toc,
}: ContentPageProps) {
  const tool = getToolBySlug(relatedToolSlug);
  const moreGuides = getAvailableGuides().filter((g) => g.slug !== slug);

  return (
    <Container className="py-8">
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: title },
          ]}
        />
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
        </header>

        {/* Related tool callout — the cluster link from guide → tool. */}
        {tool ? (
          <Link
            href={`/tools/${tool.slug}`}
            className="group mb-8 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900/50 dark:bg-blue-950/30 dark:hover:border-blue-800"
          >
            <span aria-hidden className="text-2xl">
              {tool.icon}
            </span>
            <div className="flex-1">
              <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                Use the {tool.name} →
              </span>
              <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">
                Skip the reading and try it yourself — free and private.
              </span>
            </div>
          </Link>
        ) : null}

        {toc && toc.length > 0 ? (
          <nav
            aria-label="On this page"
            className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              On this page
            </p>
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/* Article body — original content with semantic headings. */}
        <section className="mb-10 space-y-4 text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 dark:text-slate-300">
          {children}
        </section>

        {faqs && faqs.length > 0 ? (
          <section aria-labelledby="faq-heading" className="mb-10">
            <h2
              id="faq-heading"
              className="mb-4 text-xl font-semibold text-slate-900 dark:text-white"
            >
              Frequently asked questions
            </h2>
            <dl className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <dt className="font-medium text-slate-900 dark:text-white">{faq.question}</dt>
                  <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Cross-linking within the content hub. */}
        <MoreGuides guides={moreGuides} />
      </article>
    </Container>
  );
}

function MoreGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) return null;
  return (
    <section
      aria-labelledby="more-guides-heading"
      className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700"
    >
      <h2
        id="more-guides-heading"
        className="mb-4 text-lg font-semibold text-slate-900 dark:text-white"
      >
        More guides
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
