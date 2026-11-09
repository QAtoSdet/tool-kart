import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("compress-image-to-50kb-100kb")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "Why forms care about KB", href: "#why-kb-matters" },
  { text: "What decides an image's file size", href: "#file-size" },
  { text: "Step-by-step: hit an exact KB target", href: "#steps" },
  { text: "Tips for accepted photos", href: "#tips" },
];

const faqs: FaqItem[] = [
  {
    question: "How do I compress an image to exactly 50 KB?",
    answer:
      "Reduce the pixel dimensions first, then set JPG quality around 70–85 and check the output size. Adjust quality or dimensions down until the result is at or under 50 KB. The compressor shows the new file size after each change.",
  },
  {
    question: "Which format is best for online form photos?",
    answer:
      "JPG (JPEG) is the safest — small file size and accepted by nearly every portal. PNG is usually too large for photos, and WebP may not be accepted by older form systems.",
  },
  {
    question: "Will my photo stay private?",
    answer:
      "Yes. The compressor runs entirely in your browser using the Canvas API. Your image is never uploaded to or stored on a server.",
  },
  {
    question: "Why is my image still too large after compressing?",
    answer:
      "Pixel dimensions matter most. If the photo is very large (e.g. 4000px wide), lower the max width to a few hundred pixels before adjusting quality.",
  },
];

export default function ImageCompressGuidePage() {
  return (
    <>
      <ArticleJsonLd
        title={guide.title}
        description={guide.description}
        path={path}
        datePublished={guide.datePublished}
        dateModified={guide.lastModified}
        faqs={faqs}
      />
      <ContentPage
        slug={guide.slug}
        title={guide.title}
        description={guide.description}
        relatedToolSlug={guide.relatedToolSlug}
        toc={toc}
        faqs={faqs}
      >
        <p>
          Indian government and exam forms — SSC, passport, visa, college admissions — usually
          require a photo or signature under a specific file-size limit, often between 20 KB and 100
          KB. If your image is too large, the portal rejects it. Here is how to get under the limit
          without installing any software, using a tool that runs entirely in your browser.
        </p>

        <h2 id="why-kb-matters">Why forms care about KB</h2>
        <p>
          Form portals check the file size in kilobytes. A photo straight from a phone can be 2–5 MB
          (2,000–5,000 KB) — far above the limit. The job is to bring it down to the required KB
          while keeping it clear enough to be accepted.
        </p>

        <h2 id="file-size">What decides an image&apos;s file size</h2>
        <p>Three things drive how large an image file is:</p>
        <ul>
          <li>
            <strong>Dimensions (pixels):</strong> a 4000×3000 photo has 12 million pixels. Most forms
            need only a small image (say 200×230, or up to 600×600). Shrinking dimensions is the
            single biggest size reduction.
          </li>
          <li>
            <strong>Format:</strong> JPG and WebP compress photos far better than PNG at the same
            quality. For form photos, JPG is the safe, universally accepted choice.
          </li>
          <li>
            <strong>Quality:</strong> JPG quality (0–100) trades sharpness for size. Around 80 is
            usually indistinguishable to the eye but much smaller than 100.
          </li>
        </ul>

        <h2 id="steps">Step-by-step: hit an exact KB target</h2>
        <ol>
          <li>
            Upload your photo to the <a href="/tools/image-compressor">image compressor</a>.
          </li>
          <li>Resize: set a max width that matches the form&apos;s pixel need (commonly 200–600px).</li>
          <li>Choose JPG format and a quality around 70–85.</li>
          <li>Check the resulting file size shown after compression.</li>
          <li>
            Still over the limit? Lower the quality a little, or reduce the dimensions, and compress
            again.
          </li>
          <li>Download the result and upload it to your form.</li>
        </ol>

        <h2 id="tips">Tips for accepted photos</h2>
        <ul>
          <li>
            Crop to the required aspect ratio first (passport is 4.5 × 3.5 cm; many forms want
            square). Cropping removes background and shrinks the file.
          </li>
          <li>Avoid PNG for photos — it is far larger than JPG at the same quality.</li>
          <li>
            If a form says &quot;20–50 KB&quot;, aim for the middle (around 35 KB) so small
            variations don&apos;t push you over after re-saving.
          </li>
          <li>Everything happens in your browser — your photo never gets uploaded to a server.</li>
        </ul>
      </ContentPage>
    </>
  );
}
