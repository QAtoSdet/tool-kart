import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { ImageToKb } from "@/components/tools/ImageToKb";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("compress-image-to-kb")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Compress Image to 20 KB, 50 KB, 100 KB — Photo Size Reducer for Forms",
  description:
    "Reduce a photo or signature to under 20, 50, 100 or 200 KB (or any size) for SSC, UPSC, bank and job forms. Automatic, free, and nothing is uploaded.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How does it hit the exact size?",
    answer:
      "It tries several JPG quality levels and keeps the highest one that fits under your limit. If even a low quality is too big, it shrinks the photo's pixel dimensions step by step until it fits, without letting quality drop so far that text or faces become hard to read.",
  },
  {
    question: "Will the file be exactly 50 KB?",
    answer:
      "It will be at or just under 50 KB, never over. Forms set a maximum, so being slightly under is what you want.",
  },
  {
    question: "Why is the result always a JPG?",
    answer:
      "Almost every Indian exam and government portal accepts JPG, and JPG photos are much smaller than PNG at the same quality. If you upload a PNG, it is converted, and transparent areas become white.",
  },
  {
    question: "My form says KB. Is that 1,000 or 1,024 bytes?",
    answer:
      "Portals differ, so this tool uses the stricter 1,000 bytes per KB. A file it makes for 50 KB is at most 50,000 bytes, which also fits a portal that counts 1 KB as 1,024 bytes.",
  },
  {
    question: "Is my photo uploaded anywhere?",
    answer:
      "No. The resizing happens entirely in your browser, so your photo, signature or ID never leaves your device.",
  },
];

const howToSteps: string[] = [
  "Choose your photo or signature, or drag it onto the box.",
  "Pick the size limit your form asks for, or type your own.",
  "Optionally set a max width if the form also limits pixel size.",
  "Press the button, then download the JPG.",
];

export default function CompressImageToKbPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="Compress Image to KB"
        description="Get your photo or signature under the exact size your form asks for, in one step."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Made for exam and job application forms
            </h2>
            <p>
              SSC, UPSC, IBPS, railway, passport and university portals all reject photos and
              signatures above a size limit, usually somewhere between 10 KB and 200 KB. Instead of
              guessing quality settings and trying again, choose the limit and this tool finds the
              best-looking version that fits.
            </p>
            <p>
              For tips on crop, format and why forms care about KB, read{" "}
              <a href="/guides/compress-image-to-50kb-100kb" className="text-blue-600 underline">
                how to compress an image to 50 KB or 100 KB
              </a>
              . If you&apos;d rather set the quality and size yourself, use the{" "}
              <a href="/tools/image-compressor" className="text-blue-600 underline">
                image compressor
              </a>
              . The result here is always a JPG; if your form needs PNG, use the{" "}
              <a href="/tools/image-format-converter" className="text-blue-600 underline">
                image format converter
              </a>
              .
            </p>
          </>
        }
        faqs={faqs}
      >
        <ImageToKb />
      </ToolPage>
    </>
  );
}
