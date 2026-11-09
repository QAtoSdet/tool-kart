import type { FaqItem } from "@/components/tools/ToolPage";
import { SITE } from "@/lib/site";

/**
 * JSON-LD structured data for a guide (content) page: an `Article` entity and,
 * if FAQs are supplied, a `FAQPage` entity. The Article entity (with
 * datePublished/dateModified and a named publisher) helps search engines treat
 * the page as fresh, original content and can earn "Article" rich results.
 *
 * Mirrors `ToolJsonLd` so tool pages and guide pages each emit the schema that
 * fits them best.
 */
export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  faqs,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  faqs?: FaqItem[];
}) {
  const url = `${SITE.url.replace(/\/$/, "")}${path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: title,
      description,
      url,
      datePublished,
      dateModified,
      author: { "@type": "Organization", name: SITE.name },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // Serialized from our own trusted content, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
