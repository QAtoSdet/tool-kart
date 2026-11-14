import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("gst-rates-in-india-explained")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "The GST slabs since 22 September 2025", href: "#gst-slabs" },
  { text: "CGST, SGST and IGST", href: "#cgst-sgst-igst" },
  { text: "Adding GST (with example)", href: "#add-gst" },
  { text: "Removing GST (with example)", href: "#remove-gst" },
];

const faqs: FaqItem[] = [
  {
    question: "What are the GST rates in India?",
    answer:
      "Since 22 September 2025, India's GST slabs are 0%, 5%, 18% and 40%, with special rates such as 3% on gold and 0.25% on rough diamonds. Most everyday goods and services fall under 5% or 18%; 40% applies to tobacco, pan masala, aerated drinks and luxury goods.",
  },
  {
    question: "What happened to the 12% and 28% GST slabs?",
    answer:
      "They were abolished from 22 September 2025 after the 56th GST Council meeting. Most items at 12% moved to 5%, and most items at 28% (such as ACs, TVs, cement, small cars and two-wheelers up to 350cc) moved to 18%. A few luxury and sin goods moved to the new 40% slab.",
  },
  {
    question: "What is the difference between CGST, SGST and IGST?",
    answer:
      "For sales within a state, GST splits into CGST (the central half) and SGST (the state half). For interstate sales or imports, the full rate is collected as IGST. The total tax is the same either way; only the sharing between Centre and state differs.",
  },
  {
    question: "How do I add GST to a price?",
    answer:
      "Multiply the base price by the GST rate as a decimal. For 18%: GST = price × 0.18, and the total = price + GST.",
  },
  {
    question: "How do I remove GST from a price?",
    answer:
      "Divide the GST-inclusive price by (1 + rate). For 18%: base = price ÷ 1.18. The difference between the two is the GST amount.",
  },
];

export default function GstGuidePage() {
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
          GST (Goods and Services Tax) replaced a stack of older indirect taxes in India in 2017.
          Since 22 September 2025, after the 56th GST Council meeting, most goods and services fall
          into just two slabs, 5% and 18%, with a 40% slab for a small group of sin and luxury goods.
          This guide explains what each slab covers, how CGST and SGST split, and how to add or
          remove GST from any amount.
        </p>

        <h2 id="gst-slabs">The GST slabs since 22 September 2025</h2>
        <ul>
          <li>
            <strong>0%</strong> — essentials and exempt services, including individual health and
            life insurance (exempt from 22 September 2025).
          </li>
          <li>
            <strong>5%</strong> — common-use items such as hair oil, toilet soap and shampoo, and farm
            machinery. Most items that used to be at 12% moved here.
          </li>
          <li>
            <strong>18%</strong> — the standard rate for most goods and services, including ACs, TVs,
            cement, small cars and two-wheelers up to 350cc (all cut from 28%).
          </li>
          <li>
            <strong>40%</strong> — tobacco, pan masala, aerated drinks and luxury goods.
          </li>
        </ul>
        <p>
          The old <strong>12%</strong> and <strong>28%</strong> slabs were abolished. Special rates
          still exist for a few items, such as 3% on gold and 0.25% on rough diamonds. The rate for a
          particular product depends on its HSN classification, so check the official notification
          when it matters, for example on an invoice.
        </p>

        <h2 id="cgst-sgst-igst">CGST, SGST and IGST</h2>
        <p>
          The total GST rate is what matters to a buyer, but it is split depending on where the sale
          happens:
        </p>
        <ul>
          <li>
            For a sale <strong>within a state</strong>, GST splits into <strong>CGST</strong>{" "}
            (central) and <strong>SGST</strong> (state), each half the slab rate.
          </li>
          <li>
            For a sale <strong>between states</strong> or on imports, the full rate is collected as{" "}
            <strong>IGST</strong> (integrated).
          </li>
        </ul>
        <p>
          So on an 18% item sold within a state, ₹100 + 18% GST = ₹118 total, made up of ₹9 CGST and
          ₹9 SGST. The customer still pays ₹118 — the split only affects how the tax is shared
          between the Centre and the state.
        </p>

        <h2 id="add-gst">Adding GST (with example)</h2>
        <p>
          &quot;Add GST&quot; means the listed price does <em>not</em> include tax — you add GST on
          top.
        </p>
        <p>
          An item priced at <strong>₹1,000</strong> with 18% GST added: GST = ₹1,000 × 18% = ₹180.
          Total = ₹1,180. Of that ₹180, ₹90 is CGST and ₹90 is SGST (for an intrastate sale).
        </p>

        <h2 id="remove-gst">Removing GST (with example)</h2>
        <p>
          &quot;Remove GST&quot; means the price is GST-inclusive and you want the pre-tax (base)
          amount. Divide by (1 + rate).
        </p>
        <p>
          A product sold at <strong>₹1,180</strong> including 18% GST: base = ₹1,180 ÷ 1.18 = ₹1,000.
          The GST portion is ₹180.
        </p>
        <p>
          Use the <a href="/tools/gst-calculator">GST calculator</a> to add or remove GST at any slab
          and see the CGST/SGST split instantly.
        </p>
      </ContentPage>
    </>
  );
}
