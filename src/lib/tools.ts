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
