import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("unit-converter")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Unit Converter — Length, Weight, Temperature & Area",
  description:
    "Convert length, weight, temperature and area units instantly, including sq ft to sq metre and kg to pounds. Free, fast and private.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Which units can I convert?",
    answer:
      "Length (m, km, ft, in, mi), weight (kg, g, lb, oz), temperature (°C, °F, K) and area (sq ft, sq m, acre), with more categories added over time.",
  },
  {
    question: "How do I convert sq ft to sq metre?",
    answer:
      "Select the Area category, choose square feet as the input and square metres as the output, then type your value for an instant result.",
  },
  {
    question: "Is temperature handled correctly?",
    answer:
      "Yes. Temperature uses the correct non-linear formulas (for example °C to °F is (°C × 9/5) + 32), not a simple ratio.",
  },
];

export default function UnitConverterPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="Unit Converter"
        description="Convert length, weight, temperature and area units instantly."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Fast, accurate unit conversion
            </h2>
            <p>
              Convert between common metric and imperial units for length, weight, temperature and
              area. Results update as you type, with two-way conversion so you can read the value in
              either direction. Useful for construction, cooking, travel and everyday maths.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Choose a category (length, weight, temperature or area).</li>
              <li>Pick the &quot;from&quot; and &quot;to&quot; units.</li>
              <li>Type a value and read the converted result instantly.</li>
            </ol>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Everyday conversions
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Property and land: square feet to square metre, acre and hectare.</li>
              <li>Cooking and shopping: grams, kilograms, pounds and ounces.</li>
              <li>Travel and study: kilometres, miles, metres, feet and inches.</li>
              <li>Weather and science: Celsius, Fahrenheit and Kelvin.</li>
            </ul>
            <p>
              Results update as you type and work both ways, so you can read the value in either
              direction. Use the swap button to flip the units instantly.
            </p>
          </>
        }
        faqs={faqs}
      >
        <UnitConverter />
      </ToolPage>
    </>
  );
}
