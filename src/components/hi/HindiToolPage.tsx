import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/tools/ShareButtons";
import type { FaqItem } from "@/components/tools/ToolPage";

/**
 * Hindi counterpart of ToolPage for /hi/tools/<slug>. Same structure and widget, Hindi text.
 * The site header and footer stay English, so the article carries lang="hi" for screen readers
 * and search engines; hreflang links are added by buildMetadata from src/lib/hindi.ts.
 */
export function HindiToolPage({
  title,
  description,
  path,
  englishPath,
  hub,
  children,
  explainer,
  faqs,
  privacyText = "सारी गणना आपके ब्राउज़र में ही होती है। आपके डाले गए नंबर हमारे सर्वर पर न भेजे जाते हैं, न सेव होते हैं।",
}: {
  /** Sentence after "पूरी तरह निजी।" — defaults to the wording for calculators. */
  privacyText?: string;
  title: string;
  description: string;
  /** This page's path, e.g. "/hi/tools/percentage-calculator". */
  path: string;
  /** The English page, linked as "This page in English". */
  englishPath: string;
  /** Middle breadcrumb (category hub), with a Hindi name. */
  hub: Crumb;
  children: React.ReactNode;
  explainer: React.ReactNode;
  faqs: FaqItem[];
}) {
  return (
    <Container className="py-8">
      <article lang="hi" className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ name: "होम", href: "/" }, hub, { name: title }]} />
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
          <p className="mt-2 text-sm">
            <Link href={englishPath} lang="en" hrefLang="en" className="text-blue-600 underline dark:text-blue-400">
              This page in English
            </Link>
          </p>
        </header>

        <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200">
          <span aria-hidden className="mt-0.5">
            🔒
          </span>
          <p>
            <span className="font-semibold">पूरी तरह निजी।</span> {privacyText}{" "}
            <Link href="/privacy" className="font-medium underline underline-offset-2">
              डेटा नीति (अंग्रेज़ी में)
            </Link>
          </p>
        </div>

        <AdSlot slot="tool-top" className="mb-6" />

        <section
          aria-label={title}
          className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          {children}
        </section>

        <section className="prose-tool mb-10 space-y-4 text-slate-700 dark:text-slate-300">{explainer}</section>

        <section aria-labelledby="faq-heading" className="mb-10">
          <h2 id="faq-heading" className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            अक्सर पूछे जाने वाले सवाल
          </h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <dt className="font-medium text-slate-900 dark:text-white">{faq.question}</dt>
                <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ShareButtons
          title={title}
          path={path}
          labels={{ heading: "इस टूल को शेयर करें", copyLink: "लिंक कॉपी करें", copied: "कॉपी हो गया!" }}
        />

        <AdSlot slot="tool-bottom" className="mt-10" />
      </article>
    </Container>
  );
}
