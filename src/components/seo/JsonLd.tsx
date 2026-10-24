import type { FaqItem } from "@/components/tools/ToolPage";
import { SITE } from "@/lib/site";

/**
 * Injects JSON-LD structured data for a tool page: a WebApplication entity and,
 * if FAQs are supplied, a FAQPage entity. Helps rich results and gives search
 * engines a clear description of the tool.
 */
export function ToolJsonLd({
  name,
  description,
  path,
  faqs,
}: {
  name: string;
  description: string;
  path: string;
  faqs?: FaqItem[];
}) {
  const url = `${SITE.url.replace(/\/$/, "")}${path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name,
      description,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
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
      // JSON is serialized from our own trusted data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
