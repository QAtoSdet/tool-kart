/**
 * Central registry of all tools.
 *
 * This is the single source of truth used by the homepage grid, the header nav,
 * and the sitemap. To surface a new tool everywhere, add a descriptor here (and
 * create the matching route at app/tools/<slug>/page.tsx).
 */

export type ToolCategory = "Image" | "Finance" | "Calculators" | "Converters" | "Generators";

export interface Tool {
  /** URL slug; the tool lives at /tools/<slug> */
  slug: string;
  /** Short name shown in nav and cards */
  name: string;
  /** One-line description shown on cards and used in metadata */
  description: string;
  /** Grouping for the homepage */
  category: ToolCategory;
  /** Simple emoji icon (keeps bundle tiny, no icon library needed) */
  icon: string;
  /** Primary search keywords this tool targets (used for SEO/meta keywords) */
  keywords: string[];
  /** Whether the tool page is implemented and should be linked/indexed */
  available: boolean;
  /**
   * ISO date string (YYYY-MM-DD) of the last meaningful content/feature update.
   * Used by the sitemap for the <lastmod> tag so crawlers know which pages changed.
   * Update this whenever you significantly change a tool page's content or logic.
   */
  lastModified: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress and resize JPG, PNG and WebP images right in your browser. No upload, fully private.",
    category: "Image",
    icon: "🖼️",
    keywords: [
      "image compressor",
      "compress image online",
      "compress image to 100kb",
      "reduce image size",
      "resize image online",
    ],
    available: true,
    lastModified: "2026-09-15",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Create QR codes from any text or URL and download them as PNG or SVG. Free and instant.",
    category: "Generators",
    icon: "🔳",
    keywords: [
      "qr code generator",
      "qr code generator free",
      "create qr code online",
      "url to qr code",
    ],
    available: true,
    lastModified: "2026-09-15",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description:
      "Find your exact age in years, months and days, plus days until your next birthday.",
    category: "Calculators",
    icon: "🎂",
    keywords: [
      "age calculator",
      "age calculator by date of birth",
      "date difference calculator",
      "how old am i",
    ],
    available: true,
    lastModified: "2026-09-15",
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description:
      "Calculate loan EMI, total interest and amortization for home, car and personal loans.",
    category: "Finance",
    icon: "🏦",
    keywords: [
      "emi calculator",
      "loan emi calculator",
      "home loan emi calculator india",
      "car loan emi",
    ],
    available: true,
    lastModified: "2026-09-15",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert length, weight, temperature and area units instantly, including sq ft to sq m.",
    category: "Converters",
    icon: "📐",
    keywords: [
      "unit converter",
      "length converter",
      "sq ft to sq meter",
      "kg to pound converter",
      "celsius to fahrenheit",
    ],
    available: true,
    lastModified: "2026-09-15",
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    description:
      "Add or remove GST at 3%, 5%, 12%, 18% or 28% and see the CGST/SGST split instantly.",
    category: "Finance",
    icon: "🧾",
    keywords: [
      "gst calculator",
      "gst calculator india",
      "add gst",
      "remove gst",
      "cgst sgst calculator",
    ],
    available: true,
    lastModified: "2026-10-10",
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description:
      "Estimate the maturity value and returns of a monthly SIP mutual-fund investment.",
    category: "Finance",
    icon: "📈",
    keywords: [
      "sip calculator",
      "sip calculator india",
      "mutual fund sip calculator",
      "sip return calculator",
    ],
    available: true,
    lastModified: "2026-10-10",
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    description:
      "Compare your income tax under the new and old regimes for FY 2026-27 and see which saves more.",
    category: "Finance",
    icon: "🧮",
    keywords: [
      "income tax calculator",
      "income tax calculator fy 2026-27",
      "new vs old tax regime calculator",
      "tax calculator india",
    ],
    available: true,
    lastModified: "2026-11-09",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description:
      "Work out X% of a number, what percent one number is of another, and percentage change.",
    category: "Calculators",
    icon: "％",
    keywords: [
      "percentage calculator",
      "percent of a number",
      "percentage increase calculator",
      "what percent is x of y",
    ],
    available: true,
    lastModified: "2026-10-12",
  },
  {
    slug: "cgpa-to-percentage",
    name: "CGPA to Percentage Calculator",
    description:
      "Convert CGPA to percentage with the official CBSE, VTU, GTU or Anna University formula, or your own.",
    category: "Calculators",
    icon: "🎓",
    keywords: [
      "cgpa to percentage",
      "cgpa to percentage calculator",
      "cbse cgpa to percentage",
      "vtu cgpa to percentage",
      "convert cgpa to percentage",
    ],
    available: true,
    lastModified: "2026-11-10",
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description:
      "Count words, characters, sentences and paragraphs with an estimated reading time.",
    category: "Calculators",
    icon: "🔤",
    keywords: [
      "word counter",
      "character counter",
      "word count tool",
      "count words online",
    ],
    available: true,
    lastModified: "2026-10-12",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Create strong, random passwords in your browser with length and character options.",
    category: "Generators",
    icon: "🔑",
    keywords: [
      "password generator",
      "strong password generator",
      "random password generator",
      "secure password",
    ],
    available: true,
    lastModified: "2026-10-15",
  },
];

/** Tools that are implemented and should be shown/indexed. */
export function getAvailableTools(): Tool[] {
  return TOOLS.filter((t) => t.available);
}

/** Look up a single tool by slug. */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** Group available tools by category, preserving category order of first appearance. */
export function getToolsByCategory(): { category: ToolCategory; tools: Tool[] }[] {
  const order: ToolCategory[] = [];
  const map = new Map<ToolCategory, Tool[]>();
  for (const tool of getAvailableTools()) {
    if (!map.has(tool.category)) {
      map.set(tool.category, []);
      order.push(tool.category);
    }
    map.get(tool.category)!.push(tool);
  }
  return order.map((category) => ({ category, tools: map.get(category)! }));
}
