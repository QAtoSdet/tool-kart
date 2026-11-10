import type { Metadata } from "next";
import { ContentPage, type TocItem } from "@/components/guides/ContentPage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import type { FaqItem } from "@/components/tools/ToolPage";
import { getGuideBySlug } from "@/lib/guides";

const guide = getGuideBySlug("how-to-convert-cgpa-to-percentage")!;
const path = `/guides/${guide.slug}`;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path,
  keywords: guide.keywords,
});

const toc: TocItem[] = [
  { text: "Why there's no single formula", href: "#no-single-formula" },
  { text: "The CBSE formula (and why 9.5)", href: "#cbse" },
  { text: "University formulas", href: "#universities" },
  { text: "Same CGPA, different percentages", href: "#comparison" },
  { text: "Filling in a job or admission form", href: "#forms" },
];

const faqs: FaqItem[] = [
  {
    question: "Is CGPA × 9.5 valid for every university?",
    answer:
      "No. CGPA × 9.5 is CBSE's indicative formula, and some universities also use it, but many have their own. VTU, GTU and Anna University each publish a different rule. Use the one your institution states.",
  },
  {
    question: "Can I convert SGPA to percentage the same way?",
    answer:
      "Universities usually define the conversion for the final CGPA. If a form asks for a single semester, check with your college before applying the same formula to an SGPA.",
  },
  {
    question: "What if my college gave me a conversion certificate?",
    answer:
      "Use that. A conversion certificate or a formula printed on your marksheet from your own institution always takes priority over a general calculator.",
  },
];

export default function CgpaGuidePage() {
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
          Your marksheet shows a CGPA, but a job form, bank exam or admission portal asks for a
          percentage. Converting it looks simple, yet the answer changes depending on who awarded
          your grades. Here is how to get the right number.
        </p>

        <h2 id="no-single-formula">Why there&apos;s no single formula</h2>
        <p>
          A CGPA (Cumulative Grade Point Average) summarises your grades on a 10-point scale. Each
          board and university decides how grade points map back to marks, so each one also sets
          its own CGPA-to-percentage rule. That is why the same CGPA can give different percentages
          for students from different institutions.
        </p>

        <h2 id="cbse">The CBSE formula (and why 9.5)</h2>
        <p>
          For CBSE, multiply your CGPA by 9.5. CBSE gave this as an <em>indicative</em> conversion
          in Circular No. 24 of 2010, when it introduced grading. An 8.4 CGPA becomes 8.4 × 9.5 =
          79.8%.
        </p>
        <p>
          The 9.5 comes from CBSE&apos;s own results. Students in the top grade band (91–100 marks,
          grade point 10) had averaged about 95 marks, and 95 ÷ 10 = 9.5. This also means the
          highest possible percentage under the formula is 95%, not 100%.
        </p>

        <h2 id="universities">University formulas</h2>
        <ul>
          <li>
            <strong>VTU, 2022 scheme</strong> (subject codes starting with B, such as BCS301): CGPA
            × 10.
          </li>
          <li>
            <strong>VTU, 2015–2021 schemes</strong> (codes like 18CS32 or 21CS32): (CGPA − 0.75) ×
            10.
          </li>
          <li>
            <strong>GTU</strong>: (CGPA − 0.5) × 10, from GTU&apos;s Academic Council Notification
            1/2012. A 7.62 CPI is 71.2%.
          </li>
          <li>
            <strong>Anna University</strong>: CGPA × 10.
          </li>
        </ul>
        <p>
          Many other universities publish their own rule in their regulations or on the marksheet.
          It usually takes one of two shapes: CGPA × a multiplier, or (CGPA − a number) × a
          multiplier. The calculator&apos;s &quot;Other&quot; option handles both.
        </p>

        <h2 id="comparison">Same CGPA, different percentages</h2>
        <p>Take a CGPA of 8.2:</p>
        <ul>
          <li>CBSE: 8.2 × 9.5 = 77.9%</li>
          <li>VTU 2022 scheme: 8.2 × 10 = 82%</li>
          <li>VTU 2015–2021 schemes: (8.2 − 0.75) × 10 = 74.5%</li>
          <li>GTU: (8.2 − 0.5) × 10 = 77%</li>
        </ul>
        <p>
          That is a 7.5-point spread from one CGPA, which can decide whether you clear a 75% cut-off.
          Try it in the <a href="/tools/cgpa-to-percentage">CGPA to percentage calculator</a>.
        </p>

        <h2 id="forms">Filling in a job or admission form</h2>
        <ul>
          <li>Use the formula your own board or university publishes, not a generic one.</li>
          <li>
            If your institution issues a conversion certificate or prints the formula on the
            marksheet, use that and keep a copy for document verification.
          </li>
          <li>
            Autonomous colleges sometimes follow their own regulations, so check with the
            examination section if you are unsure.
          </li>
          <li>Enter the percentage exactly as calculated; don&apos;t round up to meet a cut-off.</li>
        </ul>
      </ContentPage>
    </>
  );
}
