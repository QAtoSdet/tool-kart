import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { WordCounter } from "@/components/tools/WordCounter";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("word-counter")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Word & Character Counter — Count Words Online",
  description:
    "Free word and character counter. Count words, characters, sentences, paragraphs and reading time as you type. Runs in your browser, nothing stored.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Does it count characters with and without spaces?",
    answer: "Yes. It shows both the total character count and the count excluding spaces.",
  },
  {
    question: "How is reading time estimated?",
    answer:
      "Reading time is based on an average reading speed of about 200 words per minute, rounded up to the nearest minute.",
  },
  {
    question: "Is my text sent anywhere?",
    answer:
      "No. The counting happens entirely in your browser, so your text never leaves your device.",
  },
];

export default function WordCounterPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="Word & Character Counter"
        description="Count words, characters, sentences and more as you type."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Count words and characters instantly
            </h2>
            <p>
              Paste or type your text and see live counts for words, characters (with and without
              spaces), sentences and paragraphs, plus an estimated reading time. Useful for essays,
              assignments, social-media posts, meta descriptions and anything with a length limit.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Common uses</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Staying within an essay or assignment word limit.</li>
              <li>Checking a tweet, caption or bio character count.</li>
              <li>Writing meta titles and descriptions for SEO.</li>
            </ul>
          </>
        }
        faqs={faqs}
      >
        <WordCounter />
      </ToolPage>
    </>
  );
}
