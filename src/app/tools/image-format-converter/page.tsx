import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { ImageFormatConverter } from "@/components/tools/ImageFormatConverter";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("image-format-converter")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Image Format Converter — PNG, JPG & WebP",
  description:
    "Convert images between PNG, JPG and WebP for free. Files stay in your browser and are never uploaded. HEIC is not supported.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Which image formats can I convert?",
    answer:
      "You can convert JPG, PNG and WebP images to any of those three formats. HEIC and HEIF files are not supported.",
  },
  {
    question: "Will converting resize my image?",
    answer:
      "No. The converter keeps the original pixel dimensions. Use the image compressor if you also want to resize the image.",
  },
  {
    question: "What happens to transparent areas when converting to JPG?",
    answer:
      "JPG does not support transparency, so transparent areas are filled with white in the converted image.",
  },
  {
    question: "Are my images uploaded?",
    answer:
      "No. Conversion uses your browser's Canvas API. Your images stay on your device and are not sent to a server.",
  },
];

const howToSteps: string[] = [
  "Choose a JPG, PNG or WebP image, or drag it onto the drop zone.",
  "Select the output format.",
  "Convert the image and download the new file.",
];

export default function ImageFormatConverterPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="Image Format Converter"
        description="Convert between JPG, PNG and WebP without uploading or resizing your image."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Convert image formats privately
            </h2>
            <p>
              Change an image to the format a website, form or app needs. The converter supports
              JPG, PNG and WebP, keeps the original pixel dimensions, and processes everything in
              your browser. HEIC and HEIF photos are not supported.
            </p>
            <p>
              To reduce file size or dimensions as well, use the{" "}
              <a href="/tools/image-compressor" className="text-blue-600 underline">
                image compressor
              </a>
              . For a specific upload limit, try{" "}
              <a href="/tools/compress-image-to-kb" className="text-blue-600 underline">
                compress image to KB
              </a>
              .
            </p>
          </>
        }
        faqs={faqs}
      >
        <ImageFormatConverter />
      </ToolPage>
    </>
  );
}
