import { SITE } from "@/lib/site";

export interface ItemListEntry {
  /** Human-readable name of the item (e.g. the tool name). */
  name: string;
  /** Site-relative path for the item, e.g. "/tools/emi-calculator". */
  path: string;
}

/**
 * Renders an `ItemList` JSON-LD block listing a set of pages (tools, guides,
 * …). Useful on the homepage and on category hub pages: it tells search engines
 * the site's content map and is eligible for richer listing representations.
 *
 * Paths are relative and resolved against the canonical site URL, so this
 * stays correct regardless of the deploy domain.
 */
export function ItemListJsonLd({ items }: { items: ItemListEntry[] }) {
  const base = SITE.url.replace(/\/$/, "");
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${base}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Serialized from our own trusted registry data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
