import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("simple-vs-compound-interest")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "The two formulas", href: "#formulas" },
  { text: "A 5-year FD example", href: "#five-years" },
  { text: "Why the gap grows over time", href: "#twenty-years" },
  { text: "The rule of 72", href: "#rule-of-72" },
  { text: "Where you'll meet each one", href: "#where" },
];

const faqs: FaqItem[] = [
  {
    question: "Which is better, simple or compound interest?",
    answer:
      "When you're saving or investing, compound interest is better because your interest earns interest. When you're borrowing, simple interest costs you less.",
  },
  {
    question: "Are FDs simple or compound interest?",
    answer:
      "Most cumulative FDs in India compound interest quarterly. Non-cumulative FDs that pay out interest monthly or quarterly effectively earn simple interest, because the interest is paid to you instead of being added to the deposit.",
  },
  {
    question: "Why does my FD pay slightly more than the rate suggests?",
    answer:
      "Because of quarterly compounding. A 7% FD compounded quarterly earns about 7.19% a year in effect, which is why banks sometimes quote an 'effective yield' above the headline rate.",
  },
];

export default function SimpleVsCompoundInterestGuidePage() {
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
          Whether you&apos;re opening a fixed deposit, comparing loans or reading a maths textbook,
          the same question comes up: is the interest simple or compound? The answer can change the
          final amount by lakhs over a long period.
        </p>

        <h2 id="formulas">The two formulas</h2>
        <p>
          <strong>Simple interest = P × R × T ÷ 100</strong>
        </p>
        <p>
          <strong>Compound amount = P × (1 + R ÷ (100 × n))<sup>n × T</sup></strong>
        </p>
        <ul>
          <li>P = principal (the amount you start with)</li>
          <li>R = annual interest rate in percent</li>
          <li>T = time in years</li>
          <li>n = how many times a year interest compounds (1 yearly, 4 quarterly, 12 monthly)</li>
        </ul>
        <p>
          With simple interest you earn the same amount every year. With compound interest, each
          period&apos;s interest joins the balance and earns interest from then on.
        </p>

        <h2 id="five-years">A 5-year FD example</h2>
        <p>Say you deposit ₹1,00,000 at 7% a year for 5 years.</p>
        <ul>
          <li>
            <strong>Simple interest:</strong> ₹7,000 a year for 5 years = ₹35,000. You get back
            ₹1,35,000.
          </li>
          <li>
            <strong>Compounded yearly:</strong> you get back ₹1,40,255, or ₹5,255 more than simple
            interest.
          </li>
          <li>
            <strong>Compounded quarterly</strong> (how most bank FDs work): you get back ₹1,41,478,
            another ₹1,223 on top.
          </li>
        </ul>
        <p>
          Run your own figures in the{" "}
          <a href="/tools/interest-calculator">simple and compound interest calculator</a>.
        </p>

        <h2 id="twenty-years">Why the gap grows over time</h2>
        <p>
          Over 5 years the difference is a few thousand rupees. Leave the same ₹1,00,000 at 7% for 20
          years and it becomes:
        </p>
        <ul>
          <li>Simple interest: ₹2,40,000</li>
          <li>Compounded yearly: ₹3,86,968</li>
        </ul>
        <p>
          That&apos;s ₹1,46,968 more from compounding alone, on the same deposit and rate. Simple
          interest grows in a straight line; compound interest grows faster every year, because each
          year&apos;s interest is calculated on a bigger balance. Time matters more than anything else.
        </p>

        <h2 id="rule-of-72">The rule of 72</h2>
        <p>
          A quick way to estimate how long compound interest takes to double your money: divide 72
          by the interest rate. At 7%, 72 ÷ 7 ≈ 10.3 years. The exact answer with yearly compounding
          is about 10.2 years, so the shortcut is close enough for planning.
        </p>

        <h2 id="where">Where you&apos;ll meet each one</h2>
        <ul>
          <li>
            <strong>Compound:</strong> cumulative fixed deposits, recurring deposits, PPF, savings
            accounts and most investments. Credit-card debt also compounds, which is why it grows so
            fast.
          </li>
          <li>
            <strong>Simple:</strong> some short-term personal and vehicle loans, non-cumulative FDs
            that pay interest out to you, and school maths problems.
          </li>
          <li>
            Home loans and other EMI loans use a reducing balance, which is different again. Use the{" "}
            <a href="/tools/emi-calculator">EMI calculator</a> for those.
          </li>
        </ul>
      </ContentPage>
    </>
  );
}
