import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getAvailableExams, sizeRange } from "@/lib/exams";

export const metadata: Metadata = buildMetadata({
  title: "Exam Photo and Signature Size Guide (SSC, UPSC, IBPS, NEET)",
  description:
    "Official photo and signature size rules for SSC, UPSC, IBPS, SBI and NEET application forms, checked against each exam's own notice, with a free resizer preset to each limit.",
  path: "/exams",
  keywords: ["exam photo size", "photo and signature size for exam form", "signature size kb"],
});

export default function ExamsHub() {
  const exams = getAvailableExams();
  return (
    <>
      <ItemListJsonLd items={exams.map((e) => ({ name: e.title, path: `/exams/${e.slug}` }))} />
      <Container className="py-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Exam photo sizes" }]} />
        <header className="mb-8 mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exam photo and signature sizes
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Each exam sets its own limits, and many websites still quote old ones. These pages use
            each exam&apos;s official notice, show where the rule comes from, and let you resize your
            photo and signature to fit, without uploading them anywhere.
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2">
          {exams.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/exams/${e.slug}`}
                className="block h-full rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700"
              >
                <h2 className="font-semibold text-slate-900 dark:text-white">{e.name}</h2>
                <ul className="mt-2 space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {e.uploads.map((u) => (
                    <li key={u.id}>
                      {u.label}: {u.uploadable ? sizeRange(u) : "captured live"}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          Exam not listed? Use{" "}
          <Link href="/tools/compress-image-to-kb" className="text-blue-600 underline dark:text-blue-400">
            compress image to KB
          </Link>{" "}
          with the size from your notice.
        </p>
      </Container>
    </>
  );
}
