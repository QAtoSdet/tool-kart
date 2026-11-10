/**
 * Central registry of category hub pages — one landing page per tool category.
 *
 * Mirrors the tool/guide registries: each hub is a mid-tail ranking target
 * ("finance calculator india") and a link-equity layer between the homepage and
 * the individual tools. Adding a hub here surfaces it in the sitemap (via
 * `routes.ts`) and on the homepage's "Browse by category" section.
 */
import type { ToolCategory } from "@/lib/tools";

export interface CategoryHub {
  /** The tool category this hub groups. */
  category: ToolCategory;
  /** URL slug; the hub lives at /<slug>. */
  slug: string;
  /** Full hub title — rendered as the H1 and used in metadata. */
  title: string;
  /** Short label for breadcrumbs and the homepage category cards. */
  shortTitle: string;
  /** Meta description (~150 chars). */
  description: string;
  /** Short intro paragraph shown under the H1. */
  intro: string;
  /** ISO date of the last meaningful update (sitemap lastmod). */
  lastModified: string;
}

export const CATEGORY_HUBS: CategoryHub[] = [
  {
    category: "Finance",
    slug: "finance-calculators",
    title: "Finance Calculators — Income Tax, EMI, GST & SIP (India)",
    shortTitle: "Finance Calculators",
    description:
      "Free Indian finance calculators: income tax (new vs old regime), loan EMI, GST with CGST/SGST split, and mutual-fund SIP returns. Instant, private, no sign-up.",
    intro:
      "Plan loans, taxes and investments with calculators built for Indian users. Each runs in your browser — your numbers never leave your device.",
    lastModified: "2026-11-09",
  },
  {
    category: "Image",
    slug: "image-tools",
    title: "Image Tools — Compress & Resize Images Online",
    shortTitle: "Image Tools",
    description:
      "Free online image tools: compress and resize JPG, PNG and WebP images right in your browser. No uploads, fully private.",
    intro:
      "Edit images without uploading them. These tools run entirely in your browser, so your photos never leave your device.",
    lastModified: "2026-11-09",
  },
  {
    category: "Calculators",
    slug: "calculators",
    title: "Online Calculators — Age, Percentage, CGPA & Word Count",
    shortTitle: "Calculators",
    description:
      "Free everyday calculators: exact age from date of birth, percentages, CGPA to percentage for CBSE and universities, and a word counter with reading time. No sign-up.",
    intro:
      "Quick, private calculators for everyday tasks — from working out your exact age to converting your CGPA for a job form.",
    lastModified: "2026-11-10",
  },
  {
    category: "Converters",
    slug: "converters",
    title: "Unit Converters — Length, Weight, Area & Temperature",
    shortTitle: "Converters",
    description:
      "Free online unit converters for length, weight, area and temperature, including sq ft to sq m and Celsius to Fahrenheit. Instant and private.",
    intro:
      "Convert between common units instantly — length, weight, area and temperature — all in your browser.",
    lastModified: "2026-11-09",
  },
  {
    category: "Generators",
    slug: "generators",
    title: "Online Generators — QR Codes & Strong Passwords",
    shortTitle: "Generators",
    description:
      "Free online generators: create QR codes from any text or URL, and generate strong random passwords. Private, no sign-up.",
    intro:
      "Generate QR codes and strong passwords in your browser — nothing is sent to a server.",
    lastModified: "2026-11-09",
  },
];

/** All category hubs. */
export function getAvailableHubs(): CategoryHub[] {
  return CATEGORY_HUBS;
}

/** Look up a hub by its URL slug. */
export function getHubBySlug(slug: string): CategoryHub | undefined {
  return CATEGORY_HUBS.find((h) => h.slug === slug);
}

/** Look up the hub for a given tool category. */
export function getHubByCategory(category: ToolCategory): CategoryHub | undefined {
  return CATEGORY_HUBS.find((h) => h.category === category);
}

/** All hub routes, as site-relative paths (e.g. "/finance-calculators"). */
export function getHubRoutes(): string[] {
  return CATEGORY_HUBS.map((h) => `/${h.slug}`);
}
