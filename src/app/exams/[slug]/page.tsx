import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { ExamResizer } from "@/components/exams/ExamResizer";
import { getAvailableExams, getExamBySlug, sizeRange } from "@/lib/exams";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableExams().map((e) => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exam = getExamBySlug((await params).slug);
  if (!exam) return {};
  return buildMetadata({
    title: exam.title,
    description: exam.description,
    path: `/exams/${exam.slug}`,
    keywords: exam.keywords,
  });
}

const checkedLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function ExamPage({ params }: Props) {
  const exam = getExamBySlug((await params).slug);
  if (!exam) notFound();
  const path = `/exams/${exam.slug}`;
  const others = getAvailableExams().filter((e) => e.slug !== exam.slug);
  const resizable = exam.uploads.some((u) => u.uploadable);

  return (
    <>
      <ArticleJsonLd
        title={exam.title}
        description={exam.description}
        path={path}
        datePublished={exam.lastChecked}
        dateModified={exam.lastChecked}
        faqs={exam.faqs}
      />
      <Container className="py-8">
        <article className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Exam photo sizes", href: "/exams" },
              { name: exam.name },
            ]}
          />
          <header className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{exam.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{exam.summary}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Checked against the official {exam.sources.length > 1 ? "documents" : "document"} on{" "}
              <time dateTime={exam.lastChecked}>{checkedLabel(exam.lastChecked)}</time>.{" "}
              <a href="#sources" className="text-blue-600 underline dark:text-blue-400">
                See sources
              </a>
            </p>
          </header>

          <section aria-labelledby="req-heading" className="mb-8">
            <h2 id="req-heading" className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
              {exam.name} upload requirements
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <caption className="sr-only">{exam.name} photo and signature requirements</caption>
                <thead className="bg-slate-50 text-left dark:bg-slate-800/60">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold text-slate-900 dark:text-white">Item</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-slate-900 dark:text-white">File size</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-slate-900 dark:text-white">Format and dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {exam.uploads.map((u) => (
                    <tr key={u.id}>
                      <th scope="row" className="px-3 py-2 text-left font-medium text-slate-900 dark:text-white">{u.label}</th>
                      <td className={`px-3 py-2 text-slate-700 dark:text-slate-200 ${u.uploadable ? "whitespace-nowrap" : ""}`}>
                        {u.uploadable ? sizeRange(u) : "Not uploaded — captured live"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                        {[u.format, u.dimensions].filter(Boolean).join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {resizable ? (
            <>
              <div className="mb-4">
                <PrivacyBadge />
              </div>
              <section
                aria-label={`Resize for ${exam.name}`}
                className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Resize for {exam.name}</h2>
                <ExamResizer uploads={exam.uploads} />
              </section>
            </>
          ) : null}

          <section className="mb-10 space-y-6 text-slate-700 dark:text-slate-300">
            {exam.uploads.map((u) => (
              <div key={u.id}>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{u.label}</h2>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {u.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
            {exam.notes.length > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Good to know</h2>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-amber-900 dark:text-amber-100">
                  {exam.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="faq-heading" className="mb-10">
            <h2 id="faq-heading" className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              Frequently asked questions
            </h2>
            <dl className="space-y-4">
              {exam.faqs.map((f) => (
                <div key={f.question} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <dt className="font-medium text-slate-900 dark:text-white">{f.question}</dt>
                  <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="sources" aria-labelledby="sources-heading" className="mb-10 text-sm text-slate-600 dark:text-slate-400">
            <h2 id="sources-heading" className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Sources</h2>
            <ul className="list-disc space-y-1 pl-6">
              {exam.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="text-blue-600 underline dark:text-blue-400">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              Rules can change with each new notice. Always check your own exam notice before submitting;
              if it differs from this page, the notice wins. Spotted a change?{" "}
              <Link href="/contact" className="text-blue-600 underline dark:text-blue-400">
                Tell us
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="other-exams-heading" className="border-t border-slate-200 pt-8 dark:border-slate-700">
            <h2 id="other-exams-heading" className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Other exams
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {others.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/exams/${e.slug}`}
                    className="block rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-900 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:text-white dark:hover:bg-blue-950/20"
                  >
                    {e.name} photo and signature size
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Exam not listed? Use{" "}
              <Link href="/tools/compress-image-to-kb" className="text-blue-600 underline dark:text-blue-400">
                compress image to KB
              </Link>{" "}
              with the size from your notice, or read{" "}
              <Link href="/guides/compress-image-to-50kb-100kb" className="text-blue-600 underline dark:text-blue-400">
                how to compress an image for an online form
              </Link>
              .
            </p>
          </section>
        </article>
      </Container>
    </>
  );
}
