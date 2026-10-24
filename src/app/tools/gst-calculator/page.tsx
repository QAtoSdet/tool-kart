import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { GstCalculator } from "@/components/tools/GstCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("gst-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "GST Calculator — Add or Remove GST (India)",
  description:
    "Free GST calculator for India. Add or remove 3%, 5%, 12%, 18% or 28% GST and see the CGST/SGST split instantly. Runs in your browser, nothing stored.",
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
    answer: "The common Indian slabs: 0%, 3%, 5%, 12%, 18% and 28%.",
  },
];

export default function GstCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="GST Calculator"
        description="Add or remove GST and see the CGST/SGST split, instantly and privately."
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enter the amount.</li>
              <li>Pick the GST rate (3%, 5%, 12%, 18% or 28%).</li>
              <li>Choose whether to add GST (exclusive) or remove it (inclusive).</li>
            </ol>
            <p>
              Handy for shopkeepers, freelancers and small businesses preparing invoices, or for
              anyone checking the tax portion of a bill.
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
