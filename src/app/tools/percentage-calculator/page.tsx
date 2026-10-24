import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { PercentageCalculator } from "@/components/tools/PercentageCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("percentage-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Percentage Calculator — Percent of a Number & Change",
  description:
    "Free percentage calculator: find X% of a number, what percent one number is of another, and percentage increase or decrease. Instant and private.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How do I find X% of a number?",
    answer:
      "Multiply the number by the percentage divided by 100. For example, 15% of 200 is 200 × 15/100 = 30. The first box does this for you.",
  },
  {
    question: "How do I find what percent one number is of another?",
    answer:
      "Divide the first number by the second and multiply by 100. For example, 30 out of 200 is 30/200 × 100 = 15%.",
  },
  {
    question: "How is percentage increase or decrease calculated?",
    answer:
      "Subtract the old value from the new value, divide by the old value, and multiply by 100. Going from 200 to 250 is a 25% increase.",
  },
];

export default function PercentageCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="Percentage Calculator"
        description="Three common percentage calculations in one place."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Everyday percentage maths
            </h2>
            <p>
              Whether you&apos;re working out a discount, a tip, a test score or a price change,
              this tool handles the three most common percentage questions: what is X% of a number,
              X is what percent of Y, and the percentage change between two values. Results update
              as you type.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Common uses</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Discounts and sale prices.</li>
              <li>Marks and exam score percentages.</li>
              <li>Price rises and salary hikes.</li>
              <li>Tips, commissions and interest.</li>
            </ul>
          </>
        }
        faqs={faqs}
      >
        <PercentageCalculator />
      </ToolPage>
    </>
  );
}
