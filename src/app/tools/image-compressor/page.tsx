import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { ImageCompressor } from "@/components/tools/ImageCompressor";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("image-compressor")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Image Compressor — Compress & Resize Images Online",
  description:
    "Compress and resize JPG, PNG and WebP images for free. Everything runs in your browser, so your photos are never uploaded. Shrink images to a target size in seconds.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. The compression happens entirely in your browser using the Canvas API. Your images never leave your device, which keeps them private and makes the tool fast.",
  },
  {
    question: "Which formats are supported?",
    answer: "JPG, PNG and WebP. You can also convert between these formats while compressing.",
  },
  {
    question: "Can I compress an image to a specific size like 100 KB or 50 KB?",
    answer:
      "Yes. The quickest way is our Compress Image to KB tool: pick 20, 50, 100 or 200 KB (or any size) and it finds the right settings automatically. Here, you can do it by hand: lower the quality or the maximum width, press Compress, and check the new size.",
  },
  {
    question: "How do I compress a photo for an online exam or job application form?",
    answer:
      "Most forms (SSC, UPSC, bank, railway and university applications) ask for a photo under 50–200 KB and a signature under 20–50 KB. Upload your image, set the max width to around 600–800 px, lower the quality until the size fits the form's limit, then download.",
  },
  {
    question: "Does compressing reduce image quality?",
    answer:
      "Lossy formats (JPG and WebP) trade a little visual quality for a much smaller file. At 60–80% quality the difference is usually hard to notice. PNG stays lossless but compresses less.",
  },
  {
    question: "Will this work on my phone?",
    answer:
      "Yes. It runs in any modern mobile or desktop browser with no app to install, which is handy for resizing a photo for a form while you are on your phone.",
  },
];

const howToSteps: string[] = [
  "Choose an image (JPG, PNG or WebP) or drag it onto the drop zone.",
  "Pick a target quality or maximum width/height.",
  "Preview the before/after size, then download the compressed image.",
];

export default function ImageCompressorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="Image Compressor & Resizer"
        description="Shrink and resize images in your browser. No upload, completely private."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Compress images online without uploading
            </h2>
            <p>
              Large images slow down websites, fill up storage and are hard to share over email or
              chat. This tool reduces an image&apos;s file size by re-encoding it at a smaller
              dimension or lower quality — all inside your browser. Because the processing is local,
              your photos are never sent to a server.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Common uses
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Resize a photo or signature to fit the size limit on an exam or job application
                form. To hit an exact limit such as 50 KB automatically, use{" "}
                <a href="/tools/compress-image-to-kb" className="text-blue-600 underline">
                  compress image to KB
                </a>
                .
              </li>
              <li>Shrink pictures before emailing or sharing them on WhatsApp.</li>
              <li>Reduce image weight to speed up a website or blog.</li>
              <li>Convert a PNG screenshot to a smaller JPG or WebP.</li>
            </ul>
            <p>
              Everything happens on your device, so even sensitive documents like ID photos stay
              private — nothing is uploaded.
            </p>
          </>
        }
        faqs={faqs}
      >
        <ImageCompressor />
      </ToolPage>
    </>
  );
}
