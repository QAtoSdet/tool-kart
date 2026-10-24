import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { SipCalculator } from "@/components/tools/SipCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("sip-calculator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "SIP Calculator — Mutual Fund SIP Returns (India)",
  description:
    "Free SIP calculator. Estimate the maturity value and returns of a monthly mutual-fund SIP. Runs in your browser — nothing is stored.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How is SIP maturity value calculated?",
    answer:
      "It uses the future-value-of-a-series formula with monthly compounding: your monthly amount grows each month at the expected rate, and the results add up to the maturity value.",
  },
  {
    question: "Is the expected return guaranteed?",
    answer:
      "No. Mutual-fund returns are market-linked and vary year to year. The calculator assumes a constant annual return for estimation only; actual results will differ.",
  },
  {
    question: "What return rate should I use?",
    answer:
      "Many people use 10–12% for long-term equity funds as an illustration, but this is not a promise. Use a rate you consider realistic and try a few to see the range.",
  },
  {
    question: "Are my numbers saved?",
    answer: "No. Everything is calculated in your browser and nothing is sent to a server.",
  },
];

export default function SipCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="SIP Calculator"
        description="Estimate what a monthly SIP could grow into over time."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Plan your mutual-fund SIP
            </h2>
            <p>
              A Systematic Investment Plan (SIP) lets you invest a fixed amount every month in a
              mutual fund. This calculator estimates how much your SIP could be worth at the end of
              your chosen period, splitting the result into the amount you invested and the
              estimated returns on top.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enter your monthly investment.</li>
              <li>Enter an expected annual return and the number of years.</li>
              <li>See the invested amount, estimated returns and total value.</li>
            </ol>
            <p>
              Remember this is an estimate for planning, not a guarantee — real returns depend on
              the market.
            </p>
          </>
        }
        faqs={faqs}
      >
        <SipCalculator />
      </ToolPage>
    </>
  );
}
