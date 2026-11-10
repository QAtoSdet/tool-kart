import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { CgpaCalculator } from "@/components/tools/CgpaCalculator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("cgpa-to-percentage")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "CGPA to Percentage Calculator — CBSE, VTU, GTU & Anna University",
  description:
    "Convert CGPA to percentage using the official formula for CBSE (× 9.5), VTU, GTU or Anna University, or enter your own university's formula. Free and instant.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "How do I convert CBSE CGPA to percentage?",
    answer:
      "Multiply your CGPA by 9.5. For example, a CGPA of 8.4 is 8.4 × 9.5 = 79.8%. CBSE set out this indicative conversion in its Circular No. 24 of 2010.",
  },
  {
    question: "Why do different universities give different percentages?",
    answer:
      "Each board or university sets its own conversion rule. A CGPA of 8.2 is 82% under VTU's 2022 scheme but 74.5% under its 2015–2021 schemes, and 77.9% using the CBSE formula. Always use the formula your own institution publishes.",
  },
  {
    question: "Which VTU formula applies to me?",
    answer:
      "It depends on your admission year. Students on the 2022 scheme, whose subject codes start with B (such as BCS301), use CGPA × 10. Earlier schemes, with codes like 18CS32 or 21CS32, use (CGPA − 0.75) × 10.",
  },
  {
    question: "My university isn't listed. What should I do?",
    answer:
      "Choose 'Other' and enter the formula from your marksheet or university regulations. Most formulas take the form (CGPA − a number) × a multiplier, which the custom option supports.",
  },
  {
    question: "Is my CGPA stored anywhere?",
    answer: "No. The conversion runs in your browser and nothing is sent to a server.",
  },
];

const howToSteps: string[] = [
  "Enter your CGPA on a 10-point scale.",
  "Choose your board or university (or 'Other' to enter a custom formula).",
  "Read the equivalent percentage, along with the formula and its source.",
];

export default function CgpaToPercentagePage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} howToSteps={howToSteps} />
      <ToolPage
        slug={tool.slug}
        title="CGPA to Percentage Calculator"
        description="Convert your CGPA to a percentage using the official formula for your board or university."
        howToSteps={howToSteps}
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              One CGPA, several possible percentages
            </h2>
            <p>
              Job applications, bank and PSU exams and many admission forms ask for a percentage,
              but your marksheet shows a CGPA. There is no single national formula, so the right
              percentage depends on who awarded your grades. This calculator applies the formula
              published by CBSE and several major universities, and shows the source so you can
              check it.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Formulas used
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>CBSE: CGPA × 9.5</li>
              <li>VTU 2022 scheme: CGPA × 10</li>
              <li>VTU 2015–2021 schemes: (CGPA − 0.75) × 10</li>
              <li>GTU: (CGPA − 0.5) × 10</li>
              <li>Anna University: CGPA × 10</li>
            </ul>
            <p>
              For the reasoning behind these formulas and worked examples, read{" "}
              <a href="/guides/how-to-convert-cgpa-to-percentage" className="text-blue-600 underline">
                how to convert CGPA to percentage
              </a>
              .
            </p>
          </>
        }
        faqs={faqs}
      >
        <CgpaCalculator />
      </ToolPage>
    </>
  );
}
