import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("jpg-vs-png-vs-webp")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "The three formats at a glance", href: "#at-a-glance" },
  { text: "When converting makes a file bigger", href: "#bigger" },
  { text: "Which format to pick", href: "#which" },
];

const faqs: FaqItem[] = [
  {
    question: "Does converting JPG to PNG improve quality?",
    answer:
      "No. Detail that JPG compression already removed can't be brought back. Converting to PNG only stops further losses, and the file usually gets much bigger.",
  },
  {
    question: "Can every website open WebP images?",
    answer:
      "Every current major browser displays WebP. Some upload forms, especially older government and exam portals, still only accept JPG or PNG, so check the form's instructions first.",
  },
  {
    question: "Why did my image get bigger after converting?",
    answer:
      "Each format suits different content. A screenshot or logo saved as JPG, or a photo saved as PNG, is often larger than before. Try WebP, or keep the original format and compress it instead.",
  },
];

export default function JpgVsPngVsWebpGuidePage() {
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
          JPG, PNG and WebP can all hold the same picture, but they store it in different ways. Pick
          the wrong one and you get a file that&apos;s too big for a form, or a logo with a white box
          around it. Here is what each one is for.
        </p>

        <h2 id="at-a-glance">The three formats at a glance</h2>
        <ul>
          <li>
            <strong>JPG (JPEG):</strong> made for photos. It throws away detail you&apos;re unlikely
            to notice, which keeps files small. No transparency. Accepted almost everywhere,
            including nearly every exam and job form.
          </li>
          <li>
            <strong>PNG:</strong> keeps every pixel exactly (lossless) and supports transparency.
            Ideal for screenshots, logos, diagrams and text. Photos saved as PNG are very large.
          </li>
          <li>
            <strong>WebP:</strong> a newer format that can work either way, and supports
            transparency. It&apos;s often smaller than both JPG and PNG for the same picture. Every
            current major browser shows it, but some upload forms don&apos;t accept it.
          </li>
        </ul>

        <h2 id="bigger">When converting makes a file bigger</h2>
        <p>
          Converting is not the same as compressing. Each format is efficient for some content and
          wasteful for other content, so the new file can grow:
        </p>
        <ul>
          <li>
            <strong>Photo to PNG:</strong> almost always much larger, because PNG keeps all the fine
            grain and noise a photo contains.
          </li>
          <li>
            <strong>Screenshot or logo to JPG:</strong> often larger, and sharp edges and text get
            fuzzy halos. PNG or WebP suits these better.
          </li>
          <li>
            <strong>Transparent image to JPG:</strong> the transparent areas become solid white,
            since JPG can&apos;t store transparency.
          </li>
          <li>
            <strong>JPG to PNG:</strong> doesn&apos;t restore lost quality. It only freezes the image
            as it is now.
          </li>
        </ul>
        <p>
          The <a href="/tools/image-format-converter">image format converter</a> shows the size
          before and after, so you can see straight away whether a conversion helped.
        </p>

        <h2 id="which">Which format to pick</h2>
        <ul>
          <li>
            <strong>Exam, job or government form:</strong> JPG, unless the form asks for something
            else. To also meet a size limit, use{" "}
            <a href="/tools/compress-image-to-kb">compress image to KB</a>.
          </li>
          <li>
            <strong>Logo, icon or anything with a transparent background:</strong> PNG, or WebP if
            the site accepts it.
          </li>
          <li>
            <strong>Screenshot with text:</strong> PNG for sharpness, or WebP for a smaller file.
          </li>
          <li>
            <strong>Photos for your own website:</strong> WebP for the smallest files, with JPG as a
            safe fallback.
          </li>
          <li>
            <strong>Sharing on WhatsApp:</strong> any of them works, since WhatsApp re-compresses
            images itself.
          </li>
        </ul>
      </ContentPage>
    </>
  );
}
