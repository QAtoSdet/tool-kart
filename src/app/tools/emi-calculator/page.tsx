import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("emi-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "EMI Calculator — Home, Car & Personal Loan EMI (India)",
  description:
    "Calculate your loan EMI, total interest and amortization for home, car and personal loans in India. Free, instant and private — nothing is stored.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How is EMI calculated?",
    answer:
      "EMI uses the standard reducing-balance formula: P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of months.",
  },
  {
    question: "Does this work for home, car, personal and gold loans?",
    answer:
      "Yes. The EMI formula is the same across loan types — just enter the loan amount, annual interest rate and tenure for your case, whether it is a home loan, car loan, personal loan or gold loan.",
  },
  {
    question: "What is a good tenure to choose?",
    answer:
      "A longer tenure lowers the monthly EMI but increases the total interest you pay. A shorter tenure means a higher EMI but less total interest. Use the yearly breakdown to compare.",
  },
  {
    question: "Does this account for processing fees or prepayment?",
    answer:
      "This is a standard EMI estimate and does not include processing fees, insurance or prepayment. Treat the result as a close estimate for planning, then confirm exact figures with your lender.",
  },
  {
    question: "Are my loan details saved?",
    answer:
      "No. Everything is calculated in your browser and none of your numbers are sent to or stored on a server.",
  },
];

export default function EmiCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="EMI Calculator"
        description="Estimate your monthly loan EMI, total interest and payoff for any loan."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Plan your loan with a clear EMI estimate
            </h2>
            <p>
              Your EMI (Equated Monthly Instalment) is the fixed amount you pay each month until a
              loan is cleared. This calculator shows your EMI, the total interest you&apos;ll pay and
              the total amount — so you can compare loans and tenures before committing.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enter the loan amount (principal).</li>
              <li>Enter the annual interest rate and tenure.</li>
              <li>See your EMI, total interest and total payable instantly.</li>
            </ol>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Home, car and personal loan EMIs
            </h3>
            <p>
              The same calculator works for every loan type. For a home loan you might enter a
              large principal over 15–20 years; for a car or personal loan, a smaller amount over
              3–7 years. The yearly breakdown shows how much of each year&apos;s payments go to
              interest versus principal, so you can see how the balance reduces over time and
              compare two tenures before you decide.
            </p>
            <p>
              Tip: a small change in the interest rate or tenure can change your total interest
              significantly. Try a few combinations to find an EMI that fits your monthly budget
              without paying too much interest overall.
            </p>
          </>
        }
        faqs={faqs}
      >
        <EmiCalculator />
      </ToolPage>
    </>
  );
}
