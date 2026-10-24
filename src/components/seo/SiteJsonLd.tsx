import { SITE } from "@/lib/site";

/**
 * Site-wide WebSite + Organization structured data, injected once in the root
 * layout. Helps search engines show the site name and understand the publisher.
 */
export function SiteJsonLd() {
  const base = SITE.url.replace(/\/$/, "");
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: base,
        description: SITE.description,
      },
      {
        "@type": "Organization",
        name: SITE.name,
        url: base,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
