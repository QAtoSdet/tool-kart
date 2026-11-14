import type { Metadata } from "next";
import Link from "next/link";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { GstCalculator } from "@/components/tools/GstCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("gst-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "GST Calculator — Add or Remove GST (New 5%, 18%, 40% Rates)",
  description:
    "Free GST calculator for India with the rates in force since 22 September 2025: add or remove 5%, 18% or 40% GST and see the CGST/SGST split. Runs in your browser.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How do I add GST to a price?",
    answer:
      "Choose 'Add GST', enter the base (pre-tax) amount and the rate. The tool shows the GST amount and the final price including GST.",
  },
  {
    question: "How do I remove GST from an inclusive price?",
    answer:
      "Choose 'Remove GST' and enter the total price that already includes GST. The tool works backwards to show the base amount and the GST component.",
  },
  {
    question: "What are CGST and SGST?",
    answer:
      "For an intra-state sale, GST is split equally into CGST (central) and SGST (state). For 18% GST, that is 9% CGST + 9% SGST. The tool shows this split automatically.",
  },
  {
    question: "Which GST rates does it support?",
    answer:
      "The rates in force since 22 September 2025: 0%, 5%, 18% and 40%, plus the special 3% rate on gold. The old 12% and 28% slabs were abolished that day; they're still in the list, marked as old rates, for checking earlier bills.",
  },
];

const howToSteps: string[] = [
  "Enter the amount.",
  "Pick the GST rate (5%, 18% or 40% for most items since 22 September 2025).",
  "Choose whether to add GST (exclusive) or remove it (inclusive).",
];

export default function GstCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="GST Calculator"
        description="Add or remove GST and see the CGST/SGST split, instantly and privately."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Calculate GST in seconds
            </h2>
            <p>
              GST (Goods and Services Tax) applies to most goods and services in India. This
              calculator works both ways: add GST on top of a base price, or remove GST from a
              price that already includes it. It also splits the tax into CGST and SGST for
              intra-state transactions.
            </p>
            <p>
              Since 22 September 2025 (the &quot;GST 2.0&quot; changes from the 56th GST Council),
              most items are taxed at 5% or 18%, with 40% on tobacco, pan masala, aerated drinks and
              luxury goods. The 12% and 28% slabs no longer apply to new sales.
            </p>
            <p>
              Handy for shopkeepers, freelancers and small businesses preparing invoices, or for
              anyone checking the tax portion of a bill.
            </p>
            <p lang="hi">
              यह कैलकुलेटर{" "}
              <Link href="/hi/tools/gst-calculator" hrefLang="hi" className="text-blue-600 underline">
                हिंदी में
              </Link>{" "}
              भी उपलब्ध है।
            </p>
          </>
        }
        faqs={faqs}
      >
        <GstCalculator />
      </ToolPage>
    </>
  );
}
