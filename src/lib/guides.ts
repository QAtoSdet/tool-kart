/**
 * Central registry of long-form guides (the content hub).
 *
 * Mirrors `lib/tools.ts`: a single source of truth used by the guides index,
 * the sitemap, and the "related guides" strip on tool pages. Adding a guide
 * means adding a descriptor here and creating the route at
 * `app/guides/<slug>/page.tsx`.
 *
 * Each guide links to one tool via `relatedToolSlug` so the two form a topic
 * cluster — the guide answers the informational query and drives link equity
 * into the tool, while the tool page links back to its related guides.
 */

export type GuideCategory = "Finance" | "Image" | "Calculators";

export interface Guide {
  /** URL slug; the guide lives at /guides/<slug>. */
  slug: string;
  /** Full guide title, rendered as the H1 and used in metadata. */
  title: string;
  /** Short description shown on cards and in metadata. */
  description: string;
  /** Grouping for the guides index page. */
  category: GuideCategory;
  /** Slug of the tool this guide clusters with (bidirectional linking). */
  relatedToolSlug: string;
  /** Primary search keywords (used for meta keywords). */
  keywords: string[];
  /** ISO date (YYYY-MM-DD) the guide was first published (Article datePublished). */
  datePublished: string;
  /** ISO date of the last meaningful content update (sitemap lastmod + Article dateModified). */
  lastModified: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-calculate-emi",
    title: "How to Calculate EMI for a Home Loan in India (With Examples)",
    description:
      "Understand how loan EMI is calculated, what affects your monthly payment, and how to compare tenures — with a worked home-loan example.",
    category: "Finance",
    relatedToolSlug: "emi-calculator",
    keywords: [
      "how to calculate emi",
      "home loan emi calculation",
      "emi formula explained",
      "loan emi calculator india",
    ],
    datePublished: "2026-11-09",
    lastModified: "2026-11-09",
  },
  {
    slug: "gst-rates-in-india-explained",
    title: "GST Rates in India Explained (3%, 5%, 12%, 18% and 28%)",
    description:
      "A clear breakdown of India's GST slabs, what CGST and SGST mean, and how to add or remove GST from any amount.",
    category: "Finance",
    relatedToolSlug: "gst-calculator",
    keywords: [
      "gst rates india",
      "gst slabs explained",
      "cgst sgst explained",
      "how to calculate gst",
    ],
    datePublished: "2026-11-09",
    lastModified: "2026-11-09",
  },
  {
    slug: "sip-vs-lump-sum",
    title: "SIP vs Lump Sum: Which Is Better for You?",
    description:
      "A honest comparison of investing a fixed amount every month (SIP) versus all at once (lump sum), with a worked example showing how returns differ.",
    category: "Finance",
    relatedToolSlug: "sip-calculator",
    keywords: [
      "sip vs lump sum",
      "sip or lump sum which is better",
      "mutual fund sip vs one time investment",
      "lump sum investment india",
    ],
    datePublished: "2026-11-09",
    lastModified: "2026-11-09",
  },
  {
    slug: "old-vs-new-tax-regime",
    title: "Old vs New Tax Regime for FY 2026-27: Which Should You Choose?",
    description:
      "How the new and old income-tax regimes differ, when deductions make the old regime worth it, and worked examples at ₹10, ₹15 and ₹20 lakh.",
    category: "Finance",
    relatedToolSlug: "income-tax-calculator",
    keywords: [
      "old vs new tax regime",
      "which tax regime is better",
      "new tax regime fy 2026-27",
      "income tax slabs 2026-27",
    ],
    datePublished: "2026-11-09",
    lastModified: "2026-11-09",
  },
  {
    slug: "how-to-convert-cgpa-to-percentage",
    title: "How to Convert CGPA to Percentage (CBSE, VTU, GTU, Anna University)",
    description:
      "Why there's no single formula, the official conversion for CBSE and major universities, worked examples, and what to write on a job or admission form.",
    category: "Calculators",
    relatedToolSlug: "cgpa-to-percentage",
    keywords: [
      "how to convert cgpa to percentage",
      "cgpa to percentage formula",
      "why multiply cgpa by 9.5",
      "cgpa to percentage for job application",
    ],
    datePublished: "2026-11-10",
    lastModified: "2026-11-10",
  },
  {
    slug: "simple-vs-compound-interest",
    title: "Simple vs Compound Interest: The Difference, With FD Examples",
    description:
      "How simple and compound interest are calculated, why compounding frequency matters for fixed deposits, and how the gap grows over 5 and 20 years.",
    category: "Finance",
    relatedToolSlug: "interest-calculator",
    keywords: [
      "simple vs compound interest",
      "difference between simple and compound interest",
      "compound interest formula",
      "fd interest compounded quarterly",
    ],
    datePublished: "2026-11-10",
    lastModified: "2026-11-10",
  },
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs PNG vs WebP: Which Image Format Should You Use?",
    description:
      "What each format is good at, when converting makes a file bigger instead of smaller, and which format to pick for forms, websites and WhatsApp.",
    category: "Image",
    relatedToolSlug: "image-format-converter",
    keywords: [
      "jpg vs png",
      "png vs webp",
      "which image format is best",
      "should i convert png to jpg",
    ],
    datePublished: "2026-11-14",
    lastModified: "2026-11-14",
  },
  {
    slug: "compress-image-to-50kb-100kb",
    title: "Compress an Image to 50 KB or 100 KB for Online Forms (SSC, Passport)",
    description:
      "Step-by-step ways to reduce an image's file size to the exact KB limits Indian exam and government forms require — right in your browser.",
    category: "Image",
    relatedToolSlug: "compress-image-to-kb",
    keywords: [
      "compress image to 50kb",
      "compress image to 100kb",
      "reduce image size for online form",
      "passport photo size in kb",
    ],
    datePublished: "2026-11-09",
    lastModified: "2026-11-09",
  },
];

/** All published guides. */
export function getAvailableGuides(): Guide[] {
  return GUIDES;
}

/** Look up a single guide by slug. */
export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Guides whose related tool matches the given tool slug (for the tool-page strip). */
export function getGuidesForTool(toolSlug: string): Guide[] {
  return GUIDES.filter((g) => g.relatedToolSlug === toolSlug);
}

/** Group guides by category, preserving first-appearance order. */
export function getGuidesByCategory(): { category: GuideCategory; guides: Guide[] }[] {
  const order: GuideCategory[] = [];
  const map = new Map<GuideCategory, Guide[]>();
  for (const guide of getAvailableGuides()) {
    if (!map.has(guide.category)) {
      map.set(guide.category, []);
      order.push(guide.category);
    }
    map.get(guide.category)!.push(guide);
  }
  return order.map((category) => ({ category, guides: map.get(category)! }));
}
