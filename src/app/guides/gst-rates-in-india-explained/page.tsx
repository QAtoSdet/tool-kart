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
  { text: "The five main GST slabs", href: "#gst-slabs" },
  { text: "CGST, SGST and IGST", href: "#cgst-sgst-igst" },
  { text: "Adding GST (with example)", href: "#add-gst" },
  { text: "Removing GST (with example)", href: "#remove-gst" },
];

const faqs: FaqItem[] = [
  {
    question: "What are the GST rates in India?",
    answer:
      "India's main GST slabs are 0%, 5%, 12%, 18% and 28%, with special rates of 0.25% (rough diamonds) and 3% (gold) for a few items. Most everyday goods and services fall under 5%, 12% or 18%.",
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
          Most goods and services fall into one of five rate slabs. This guide explains what each
          slab covers, how CGST and SGST split, and how to add or remove GST from any amount.
        </p>

        <h2 id="gst-slabs">The five main GST slabs</h2>
        <ul>
          <li>
            <strong>0%</strong> — essentials like unbranded food grains, fresh milk, books,
            education and healthcare.
          </li>
          <li>
            <strong>5%</strong> — common-use items: packaged food, footwear up to ₹1,000, and many
            textiles.
          </li>
          <li>
            <strong>12%</strong> — processed food, computers and mobile phones.
          </li>
          <li>
            <strong>18%</strong> — most goods and services: ACs, refrigerators, soaps, hair oil,
            restaurants and financial services.
          </li>
          <li>
            <strong>28%</strong> — luxury and &quot;sin&quot; goods: cars, large motorcycles, tobacco
            and aerated drinks.
          </li>
        </ul>
        <p>
          A couple of special rates exist for specific items — 0.25% on rough diamonds and 3% on
          gold — but the five slabs above cover almost everything you will deal with.
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
