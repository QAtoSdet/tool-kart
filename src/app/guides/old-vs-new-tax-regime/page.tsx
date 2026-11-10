import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("old-vs-new-tax-regime")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "The two regimes side by side", href: "#side-by-side" },
  { text: "Worked examples", href: "#examples" },
  { text: "The break-even point", href: "#break-even" },
  { text: "How to decide", href: "#decide" },
];

const faqs: FaqItem[] = [
  {
    question: "Which tax regime is better for FY 2026-27?",
    answer:
      "For most people the new regime, because of its lower rates and the rebate that makes taxable income up to ₹12 lakh tax-free. The old regime only wins if your deductions are large, roughly ₹7 lakh or more at a ₹20 lakh salary.",
  },
  {
    question: "Can I switch between regimes every year?",
    answer:
      "Salaried individuals without business income can choose a regime each year when filing their return. People with business or professional income have limited options to switch back and forth.",
  },
  {
    question: "Is the new regime the default?",
    answer:
      "Yes. If you don't choose, your employer deducts TDS and you are assessed under the new regime. You must opt for the old regime if you want it.",
  },
  {
    question: "Do senior citizens get different slabs?",
    answer:
      "Only under the old regime: the tax-free limit is ₹3 lakh for ages 60 to 80 and ₹5 lakh above 80. The new regime uses the same slabs for everyone.",
  },
];

export default function OldVsNewTaxRegimeGuidePage() {
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
          Each year, salaried taxpayers in India pick between two ways of calculating income tax.
          Budget 2026 left both regimes unchanged for FY 2026-27 (income earned from April 2026 to
          March 2027), so the choice works the same way as last year. Here is how they differ and
          how to tell which one costs you less.
        </p>

        <h2 id="side-by-side">The two regimes side by side</h2>
        <h3>New regime (default)</h3>
        <ul>
          <li>Up to ₹4 lakh: nil</li>
          <li>₹4–8 lakh: 5% · ₹8–12 lakh: 10% · ₹12–16 lakh: 15%</li>
          <li>₹16–20 lakh: 20% · ₹20–24 lakh: 25% · above ₹24 lakh: 30%</li>
          <li>Standard deduction ₹75,000 for salaried people and pensioners</li>
          <li>Rebate up to ₹60,000, so taxable income up to ₹12 lakh pays no tax</li>
          <li>Almost no other deductions (no 80C, 80D, HRA or home-loan interest on a self-occupied house)</li>
        </ul>
        <h3>Old regime</h3>
        <ul>
          <li>Up to ₹2.5 lakh: nil (₹3 lakh for 60–80, ₹5 lakh above 80)</li>
          <li>Up to ₹5 lakh: 5% · ₹5–10 lakh: 20% · above ₹10 lakh: 30%</li>
          <li>Standard deduction ₹50,000</li>
          <li>Rebate up to ₹12,500, so taxable income up to ₹5 lakh pays no tax</li>
          <li>Allows 80C (up to ₹1.5 lakh), 80D, HRA, home-loan interest and more</li>
        </ul>
        <p>Both regimes add 4% health and education cess, and a surcharge above ₹50 lakh.</p>

        <h2 id="examples">Worked examples</h2>
        <p>All three assume a salaried person below 60.</p>
        <ul>
          <li>
            <strong>₹10 lakh salary, no deductions:</strong> new regime ₹0 (taxable ₹9.25 lakh,
            fully covered by the rebate). Old regime ₹1,06,600. The new regime saves ₹1,06,600.
          </li>
          <li>
            <strong>₹15 lakh salary, ₹1.5 lakh in 80C:</strong> new regime ₹97,500. Old regime
            ₹2,10,600. The new regime still saves ₹1,13,100, even after using the full 80C limit.
          </li>
          <li>
            <strong>₹20 lakh salary, ₹8 lakh of deductions</strong> (for example HRA, 80C, 80D and
            home-loan interest): new regime ₹1,92,400. Old regime ₹1,63,800. Here the old regime
            saves ₹28,600.
          </li>
        </ul>
        <p>
          Try your own numbers in the{" "}
          <a href="/tools/income-tax-calculator">income tax calculator</a>.
        </p>

        <h2 id="break-even">The break-even point</h2>
        <p>
          The old regime only wins once your deductions cross a break-even amount, and that amount
          rises with income. At a ₹20 lakh salary it is about ₹7.08 lakh of deductions: below that
          the new regime is cheaper, above it the old regime is. Few people reach that without a
          large HRA claim and a home loan, which is why the new regime suits most taxpayers.
        </p>

        <h2 id="decide">How to decide</h2>
        <ul>
          <li>Add up every deduction you will actually claim this year, not ones you might.</li>
          <li>Enter your salary and that total into the calculator and compare the two results.</li>
          <li>
            If the difference is small, the new regime is simpler: no investment proofs and less
            paperwork.
          </li>
          <li>Tell your employer your choice early so the right TDS is deducted each month.</li>
        </ul>
        <p>
          This guide is general information, not tax advice. For complex cases such as capital
          gains, business income or rental property, check with a tax professional.
        </p>
      </ContentPage>
    </>
  );
}
