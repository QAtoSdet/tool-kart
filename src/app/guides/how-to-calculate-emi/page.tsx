import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("how-to-calculate-emi")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "How EMI is calculated", href: "#how-emi-is-calculated" },
  { text: "Worked example: a ₹40 lakh home loan", href: "#worked-example" },
  { text: "What changes your EMI", href: "#what-changes-emi" },
  { text: "Tips to pay less interest", href: "#tips" },
];

const faqs: FaqItem[] = [
  {
    question: "How is EMI calculated?",
    answer:
      "EMI uses the reducing-balance formula P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of months.",
  },
  {
    question: "Does EMI change during the loan?",
    answer:
      "For a fixed-rate loan the EMI stays the same throughout. For a floating-rate loan the EMI (or the tenure) changes whenever the lender revises the interest rate.",
  },
  {
    question: "Is a longer tenure better?",
    answer:
      "A longer tenure lowers your monthly EMI but increases the total interest you pay. Aim for the shortest tenure whose EMI you can comfortably afford.",
  },
  {
    question: "Does prepayment reduce the EMI?",
    answer:
      "Prepayment reduces the outstanding principal. You can then choose to lower your EMI or shorten your tenure; shortening the tenure saves more interest overall.",
  },
];

export default function EmiGuidePage() {
  return (
    <>
      <ArticleJsonLd
        title={guide.title}
        description={guide.description}
        path={path}
        datePublished={guide.datePublished}
        dateModified={guide.lastModified}
        faqs={faqs}
      />
      <ContentPage
        slug={guide.slug}
        title={guide.title}
        description={guide.description}
        relatedToolSlug={guide.relatedToolSlug}
        toc={toc}
        faqs={faqs}
      >
        <p>
          When you take a home, car, or personal loan, you repay it in fixed monthly
          instalments called EMIs (Equated Monthly Instalments). Knowing how that number
          is calculated helps you compare loans, pick a tenure that fits your budget,
          and avoid paying far more interest than you need to.
        </p>

        <h2 id="how-emi-is-calculated">How EMI is calculated</h2>
        <p>EMI uses the standard reducing-balance formula:</p>
        <p>
          <strong>EMI = P × r × (1+r)<sup>n</sup> ÷ ((1+r)<sup>n</sup> − 1)</strong>
        </p>
        <ul>
          <li>
            <strong>P</strong> = loan amount (principal)
          </li>
          <li>
            <strong>r</strong> = monthly interest rate = annual rate ÷ 12 ÷ 100
          </li>
          <li>
            <strong>n</strong> = number of monthly instalments (tenure in years × 12)
          </li>
        </ul>
        <p>
          In plain terms: every month you pay a fixed amount. In the early months most of it is
          interest; as the outstanding balance falls, more of each payment goes to the principal.
          The formula balances this so the loan is exactly cleared at the end of <em>n</em> months.
        </p>

        <h2 id="worked-example">Worked example: a ₹40 lakh home loan</h2>
        <p>
          Suppose you borrow <strong>₹40,00,000</strong> at <strong>8.5% per year</strong> for{" "}
          <strong>20 years</strong> (240 months).
        </p>
        <ul>
          <li>r = 8.5 ÷ 12 ÷ 100 = 0.007083</li>
          <li>n = 20 × 12 = 240</li>
        </ul>
        <p>
          Plugging these in gives an EMI of about <strong>₹34,713</strong> a month. Over 240 months
          you pay a total of about ₹83,31,120 — of which roughly <strong>₹43,31,120 is interest</strong>,
          slightly more than the loan itself. That is the real cost of a long tenure at a moderate
          rate.
        </p>
        <p>
          Use the <a href="/tools/emi-calculator">EMI calculator</a> to try your own loan amount,
          rate and tenure and see the yearly breakdown instantly.
        </p>

        <h2 id="what-changes-emi">What changes your EMI</h2>
        <ul>
          <li>
            <strong>Principal</strong> — a larger loan means a larger EMI.</li>
          <li>
            <strong>Interest rate</strong> — even a 0.5% difference adds up over 20 years.
          </li>
          <li>
            <strong>Tenure</strong> — a longer tenure lowers the monthly EMI but raises the total
            interest sharply.
          </li>
        </ul>

        <h2 id="tips">Tips to pay less interest</h2>
        <ul>
          <li>Don&apos;t chase only the lowest EMI; a longer tenure quietly adds a lot of interest.</li>
          <li>Prepay when you can. Even a few extra EMIs a year can cut years off a home loan.</li>
          <li>Compare offers from several banks and NBFCs; rates and processing fees vary.</li>
          <li>Check whether your lender allows part-prepayment without penalty.</li>
        </ul>
      </ContentPage>
    </>
  );
}
