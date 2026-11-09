import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("sip-vs-lump-sum")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "What is a SIP vs a lump sum?", href: "#what-are-they" },
  { text: "A worked example: same ₹1.2 lakh invested", href: "#worked-example" },
  { text: "Why lump sum often wins the maths", href: "#why-lump-sum-wins" },
  { text: "Why SIP usually wins in real life", href: "#why-sip-wins" },
  { text: "Which should you choose?", href: "#which" },
];

const faqs: FaqItem[] = [
  {
    question: "Does SIP give higher returns than lump sum?",
    answer:
      "Not usually. If markets rise steadily, a lump sum gives higher returns because the whole amount compounds for the full period. SIP's strength is that it smooths out market timing and is affordable from a monthly salary, not that it produces a higher number in a rising market.",
  },
  {
    question: "Is SIP safer than a one-time investment?",
    answer:
      "SIP reduces timing risk — because you invest every month, you buy at both highs and lows, averaging your cost. But both SIP and lump sum are subject to the same market risk; SIP just spreads your entry points.",
  },
  {
    question: "What return rate should I assume for SIP calculations?",
    answer:
      "Many people use 10–12% per year for long-term equity mutual funds as an illustration, but returns are not guaranteed and vary year to year. Try a range to see best- and worst-case outcomes.",
  },
  {
    question: "Can I switch from SIP to lump sum later?",
    answer:
      "Yes. You can stop a SIP and keep the accumulated units invested, or make an additional lump-sum investment into the same fund whenever you have spare cash.",
  },
];

export default function SipVsLumpSumGuidePage() {
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
          When you invest in a mutual fund, you can put money in two ways: a <strong>SIP</strong>{" "}
          (Systematic Investment Plan) — a fixed sum every month — or a <strong>lump sum</strong>{" "}
          — the whole amount at once. People argue endlessly about which is better. The honest
          answer is: they solve different problems, and the maths is clearer than the debate.
        </p>

        <h2 id="what-are-they">What is a SIP vs a lump sum?</h2>
        <ul>
          <li>
            <strong>SIP:</strong> you invest a fixed amount (say ₹1,000) every month for a set
            number of years. You buy more units when prices are low and fewer when high, which
            averages your purchase cost.
          </li>
          <li>
            <strong>Lump sum:</strong> you invest the entire amount today and leave it to grow. The
            full sum compounds for the whole period.
          </li>
        </ul>

        <h2 id="worked-example">A worked example: same ₹1.2 lakh invested</h2>
        <p>
          To make it fair, let&apos;s invest the same total amount — ₹1,20,000 — at 12% per year over 10
          years.
        </p>
        <ul>
          <li>
            <strong>Lump sum:</strong> ₹1,20,000 invested today. After 10 years at 12% it grows to
            about <strong>₹3,72,700</strong> (returns of about ₹2,52,700).
          </li>
          <li>
            <strong>SIP:</strong> ₹1,000 a month for 120 months — the same ₹1,20,000 in total. It
            grows to about <strong>₹2,32,300</strong> (returns of about ₹1,12,300).
          </li>
        </ul>
        <p>
          So with the <em>same</em> money in and the <em>same</em> assumed return, the lump sum ends
          up larger. That is not a trick — it is because the lump sum is invested from day one, so
          all of it compounds for the full 10 years, while each SIP instalment only compounds from
          the month it goes in.
        </p>
        <p>
          Use the <a href="/tools/sip-calculator">SIP calculator</a> to project your own monthly
          amount, rate and duration.
        </p>

        <h2 id="why-lump-sum-wins">Why lump sum often wins the maths</h2>
        <p>
          Money that is invested earlier compounds for longer. In a market that goes up over time,
          the more time your money is in, the more it grows. A lump sum puts everything to work
          immediately, so in a steadily rising market it almost always beats a SIP that dribbles the
          same total in over years.
        </p>

        <h2 id="why-sip-wins">Why SIP usually wins in real life</h2>
        <p>
          The maths assumes you actually <em>have</em> ₹1.2 lakh sitting idle today — most people
          don&apos;t. A SIP matches how most people earn: a little each month from their salary.
          It also removes the impossible question of <em>when</em> to invest a lump sum. If you
          invest a lump sum and the market drops 20% the next month, you have lost on your whole
          amount; with a SIP, only the first instalment is exposed, and later instalments buy in
          cheaper. Over many years this &quot;rupee-cost averaging&quot; smooths out timing risk.
        </p>

        <h2 id="which">Which should you choose?</h2>
        <ul>
          <li>
            If you have a lump sum you don&apos;t need for a long time and you are comfortable with
            market risk, investing it (perhaps gradually over a few months to reduce timing risk)
            can give higher long-term returns.
          </li>
          <li>
            If you invest from your monthly salary, a SIP is the natural and lower-stress choice —
            it automates investing and removes the need to time the market.
          </li>
          <li>
            Many people do both: a SIP from salary, plus an occasional lump sum when they get a
            bonus.
          </li>
        </ul>
        <p>
          The right answer depends on when you have the money and how much market movement you can
          stomach — not on which one &quot;always&quot; wins.
        </p>
      </ContentPage>
    </>
  );
}
