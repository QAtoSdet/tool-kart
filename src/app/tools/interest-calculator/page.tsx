import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { InterestCalculator } from "@/components/tools/InterestCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("interest-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Simple & Compound Interest Calculator — Yearly, Quarterly, Monthly",
  description:
    "Free simple and compound interest calculator. Compare both side by side, choose yearly, half-yearly, quarterly or monthly compounding, and see the year-by-year growth.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "What is the formula for simple interest?",
    answer:
      "Simple interest = P × R × T ÷ 100, where P is the principal, R the annual rate in percent and T the time in years. Interest is earned only on the original amount.",
  },
  {
    question: "What is the formula for compound interest?",
    answer:
      "Amount = P × (1 + R ÷ (100 × n))^(n × T), where n is the number of compounding periods per year. Compound interest is that amount minus the principal. Interest is earned on earlier interest too.",
  },
  {
    question: "How often do bank FDs compound?",
    answer:
      "Most Indian banks compound fixed-deposit interest quarterly. Check your bank's terms, then pick the matching option here.",
  },
  {
    question: "Is the interest shown before or after tax?",
    answer:
      "Before tax. FD interest is added to your income and taxed at your slab rate, and banks may deduct TDS above certain limits.",
  },
  {
    question: "Are my numbers stored?",
    answer: "No. Everything is calculated in your browser and nothing is sent to a server.",
  },
];

const howToSteps: string[] = [
  "Enter the principal amount and the annual interest rate.",
  "Enter the time period in years and months.",
  "Choose how often interest compounds (quarterly for most bank FDs).",
  "Compare simple and compound interest, and see the balance year by year.",
];

export default function InterestCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="Simple & Compound Interest Calculator"
        description="See how much interest you earn or pay with simple and compound interest, side by side."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Simple vs compound interest
            </h2>
            <p>
              With simple interest you earn the same amount every year, because interest is only
              ever calculated on your original principal. With compound interest, each period&apos;s
              interest is added to the balance, so the next period&apos;s interest is calculated on a
              bigger amount. Over short periods the difference is small; over long periods it can be
              large.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Why compounding frequency matters
            </h3>
            <p>
              The more often interest compounds, the sooner it starts earning interest itself. At the
              same annual rate, quarterly compounding gives a little more than yearly, and monthly a
              little more again. That is why two FDs with the same headline rate can pay slightly
              different amounts.
            </p>
            <p>
              For worked FD examples and how the gap grows over 20 years, read{" "}
              <a href="/guides/simple-vs-compound-interest" className="text-blue-600 underline">
                simple vs compound interest
              </a>
              .
            </p>
          </>
        }
        faqs={faqs}
      >
        <InterestCalculator />
      </ToolPage>
    </>
  );
}
