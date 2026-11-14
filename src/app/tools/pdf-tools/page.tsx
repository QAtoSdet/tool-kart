import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { PdfTools } from "@/components/tools/PdfTools";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("pdf-tools")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "PDF Tools — Merge PDFs, Extract Pages & Optimize (Free, No Upload)",
  description:
    "Merge PDF files, extract pages from a PDF, or optimize a text PDF to a smaller size. Free, and everything runs in your browser, so your documents are never uploaded.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How do I merge PDF files?",
    answer:
      "Choose Merge PDFs, then select two or more files together in the file picker. They are joined in the order shown in the list, and you download one PDF.",
  },
  {
    question: "How does splitting work?",
    answer:
      "Choose Split PDF, pick a file and type the pages you want, such as 1-3, 5, 8-10, or all. Each selected page is saved as its own single-page PDF.",
  },
  {
    question: "Will Optimize make my PDF smaller?",
    answer:
      "Often, for PDFs made from text, such as documents printed or exported to PDF. It rebuilds the file more compactly without changing what you see. It does not recompress images, so scanned PDFs barely shrink. The tool shows the size before and after, so you can keep whichever is smaller.",
  },
  {
    question: "What happens to fillable forms and digital signatures?",
    answer:
      "Optimize keeps form fields and their values. Merge and Split can't carry fillable fields across, so the tool warns you; fill the form in and save it first. Any change to a digitally signed PDF makes the signature invalid, so keep the signed original where it's needed.",
  },
  {
    question: "Can I use a password-protected PDF?",
    answer:
      "Not directly. Open it in your PDF reader with the password, then use Print to PDF (or remove the password) to save an unlocked copy, and use that here.",
  },
  {
    question: "Is my PDF uploaded anywhere?",
    answer:
      "No. Processing runs entirely in your browser, so bank statements, ID scans and forms stay on your device.",
  },
];

const howToSteps: string[] = [
  "Choose Merge, Split or Optimize.",
  "Select your PDF file(s). For Split, type the pages you want.",
  "Press the button, check the result and download.",
];

export default function PdfToolsPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="PDF Tools"
        description="Merge PDFs, extract pages, or optimize a text PDF — privately, in your browser."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Everyday PDF tasks, without uploading your documents
            </h2>
            <p>
              Combine invoices or certificates into one file, pull out just the pages a form asks
              for, or tidy up a PDF exported from another app. PDFs often hold sensitive details, so
              everything here runs on your device and nothing is sent to a server.
            </p>
            <p>
              Need to shrink a scanned PDF for an upload limit? Optimizing won&apos;t help much,
              because scans are mostly images. Scanning at a lower resolution, or saving the pages as
              JPG and using{" "}
              <a href="/tools/compress-image-to-kb" className="text-blue-600 underline">
                compress image to KB
              </a>
              , usually works better.
            </p>
          </>
        }
        faqs={faqs}
      >
        <PdfTools />
      </ToolPage>
    </>
  );
}
