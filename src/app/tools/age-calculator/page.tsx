import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { AgeCalculator } from "@/components/tools/AgeCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("age-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Age Calculator — Find Your Exact Age by Date of Birth",
  description:
    "Calculate your exact age in years, months and days from your date of birth, plus days until your next birthday. Free, instant and private.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How is my age calculated?",
    answer:
      "We compute the difference between your date of birth and today's date, accounting for leap years and varying month lengths, to give an exact years/months/days result.",
  },
  {
    question: "Can I find the difference between two dates?",
    answer: "Yes. Besides age, the tool can show the gap between any two dates in days.",
  },
  {
    question: "Is my date of birth stored anywhere?",
    answer: "No. The calculation runs in your browser and nothing you enter is sent to a server.",
  },
];

export default function AgeCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="Age Calculator"
        description="Find your exact age and days to your next birthday from your date of birth."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Work out your exact age
            </h2>
            <p>
              Enter your date of birth and instantly see how old you are in years, months and days.
              The tool also tells you how many days remain until your next birthday — handy for
              forms, eligibility checks and just curiosity.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Pick your date of birth.</li>
              <li>Optionally set the &quot;as of&quot; date (defaults to today).</li>
              <li>Read your exact age and the countdown to your next birthday.</li>
            </ol>
          </>
        }
        faqs={faqs}
      >
        <AgeCalculator />
      </ToolPage>
    </>
  );
}
