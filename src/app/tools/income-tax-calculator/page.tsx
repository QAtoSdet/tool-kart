import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { IncomeTaxCalculator } from "@/components/tools/IncomeTaxCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("income-tax-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Income Tax Calculator FY 2026-27 — New vs Old Regime (India)",
  description:
    "Free income tax calculator for FY 2026-27. Compare tax under the new and old regimes with standard deduction, 87A rebate, surcharge and cess. Private, runs in your browser.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Did the tax slabs change for FY 2026-27?",
    answer:
      "No. Budget 2026 kept the slabs, the ₹75,000 standard deduction and the Section 87A rebate the same as FY 2025-26 under both regimes. The new regime remains the default.",
  },
  {
    question: "Is income up to ₹12 lakh really tax-free?",
    answer:
      "Under the new regime, yes for taxable income up to ₹12 lakh, thanks to the ₹60,000 Section 87A rebate. For salaried people the ₹75,000 standard deduction stretches that to a ₹12.75 lakh salary. Just above ₹12 lakh, marginal relief keeps the tax from jumping suddenly.",
  },
  {
    question: "Which deductions does the old regime allow?",
    answer:
      "Common ones are Section 80C (PF, PPF, ELSS, life insurance, up to ₹1.5 lakh), 80D health insurance, HRA exemption and home-loan interest on a self-occupied house. Add their total in the deductions box. The new regime does not allow these.",
  },
  {
    question: "Does this include surcharge and cess?",
    answer:
      "Yes. It adds surcharge above ₹50 lakh (with marginal relief) and the 4% health and education cess. It does not cover income taxed at special rates, such as capital gains, lottery winnings or crypto.",
  },
  {
    question: "Is my salary information stored?",
    answer:
      "No. The calculation happens entirely in your browser and nothing is sent to or stored on a server.",
  },
];

const howToSteps: string[] = [
  "Enter your gross annual income and choose your age group.",
  "Tick the salaried box to apply the standard deduction.",
  "Add your old-regime deductions (80C, 80D, HRA, home-loan interest).",
  "Compare the tax under both regimes and see which one saves more.",
];

export default function IncomeTaxCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="Income Tax Calculator (FY 2026-27)"
        description="Compare your tax under the new and old regimes and pick the one that costs you less."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              New regime or old regime?
            </h2>
            <p>
              Every year you can choose between two ways of calculating income tax. The new regime
              has lower rates and a higher tax-free limit but almost no deductions. The old regime
              has higher rates but lets you subtract investments and expenses such as 80C, health
              insurance, HRA and home-loan interest. This calculator works out both and shows the
              difference.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              How the tax is worked out
            </h3>
            <p>
              Your taxable income is your gross income minus the standard deduction (₹75,000 new,
              ₹50,000 old, for salaried people and pensioners) and, in the old regime only, your
              deductions. Tax is applied slab by slab, then the Section 87A rebate is subtracted if
              you qualify. Surcharge applies above ₹50 lakh, and finally 4% cess is added.
            </p>
            <p>
              As a rule of thumb, the new regime wins unless your deductions are large. Read our{" "}
              <a href="/guides/old-vs-new-tax-regime" className="text-blue-600 underline">
                old vs new tax regime guide
              </a>{" "}
              for worked examples and the break-even point.
            </p>
          </>
        }
        faqs={faqs}
      >
        <IncomeTaxCalculator />
      </ToolPage>
    </>
  );
}
