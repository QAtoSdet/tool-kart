import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/ads/AdSlot";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { MoreTools } from "@/components/tools/MoreTools";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolPageProps {
  /** Slug of the current tool, used to exclude it from the "more tools" strip. */
  slug: string;
  /** Tool name — rendered as the page H1. */
  title: string;
  /** One-line description shown under the title. */
  description: string;
  /** The interactive tool UI (usually a client component). */
  children: React.ReactNode;
  /**
   * Explainer content: what the tool does / how to use it. Plain React nodes so
   * each tool can write original, SEO-friendly prose. Rendered below the tool.
   */
  explainer: React.ReactNode;
  /** FAQ entries, rendered as an accessible list and reused for JSON-LD later. */
  faqs?: FaqItem[];
  /**
   * Whether this tool processes data in the browser (controls privacy badge copy).
   * Defaults to true since that is the design for all current tools.
   */
  processedInBrowser?: boolean;
}

/**
 * Shared layout for every tool page. Standardizes structure so adding a tool is
 * just: render <ToolPage> with the widget, explainer and FAQs. Also places the
 * privacy badge and reserved ad slots consistently.
 */
export function ToolPage({
  slug,
  title,
  description,
  children,
  explainer,
  faqs,
  processedInBrowser = true,
}: ToolPageProps) {
  return (
    <Container className="py-8">
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Tools", href: "/#tools" },
            { name: title },
          ]}
        />
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
        </header>

        <div className="mb-6">
          <PrivacyBadge processedInBrowser={processedInBrowser} />
        </div>

        {/* Top ad slot (above the fold but below the tool header). */}
        <AdSlot slot="tool-top" className="mb-6" />

        {/* The interactive tool — elevated panel so it reads as the focal point. */}
        <section
          aria-label={`${title} tool`}
          className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          {children}
        </section>

        {/* Original explainer content — important for SEO and AdSense. */}
        <section className="prose-tool mb-10 space-y-4 text-slate-700 dark:text-slate-300">
          {explainer}
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

        {/* Cross-tool discovery — drives pageviews-per-visit and internal links. */}
        <MoreTools currentSlug={slug} />

        {/* Bottom ad slot. */}
        <AdSlot slot="tool-bottom" className="mt-10" />
      </article>
    </Container>
  );
}
