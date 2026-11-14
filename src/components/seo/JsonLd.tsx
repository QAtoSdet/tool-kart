import type { FaqItem } from "@/components/tools/ToolPage";
import { SITE } from "@/lib/site";

/**
 * Injects JSON-LD structured data for a tool page: a WebApplication entity and,
 * if FAQs are supplied, a FAQPage entity. Optionally includes a HowTo entity
 * when step-by-step instructions are provided — this can earn rich "how-to"
 * results in Google search.
 *
 * Note: BreadcrumbList JSON-LD is emitted separately by the Breadcrumbs
 * component, which is rendered inside ToolPage.
 */
export function ToolJsonLd({
  name,
  description,
  path,
  faqs,
  howToSteps,
  inLanguage,
}: {
  /** BCP 47 language of the page, e.g. "hi" for Hindi pages. Omitted for English. */
  inLanguage?: string;
  name: string;
  description: string;
  path: string;
  faqs?: FaqItem[];
  /** Optional numbered steps; when provided a HowTo entity is added to the graph. */
  howToSteps?: string[];
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
      ...(inLanguage ? { inLanguage } : {}),
    },
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      ...(inLanguage ? { inLanguage } : {}),
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  if (howToSteps && howToSteps.length > 0) {
    graph.push({
      "@type": "HowTo",
      name: `How to use ${name}`,
      step: howToSteps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: step,
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
