import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ToolJsonLd } from "./JsonLd";

function parseLdJson(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).toBeTruthy();
  return JSON.parse(script!.textContent || "{}");
}

describe("ToolJsonLd", () => {
  it("emits valid WebApplication + FAQPage structured data", () => {
    const { container } = render(
      <ToolJsonLd
        name="EMI Calculator"
        description="Calculate your loan EMI."
        path="/tools/emi-calculator"
        faqs={[{ question: "How is EMI calculated?", answer: "Using the reducing-balance formula." }]}
      />,
    );
    const data = parseLdJson(container);
    expect(data["@context"]).toBe("https://schema.org");

    const types = data["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).toContain("FAQPage");

    const faqNode = data["@graph"].find((n: { "@type": string }) => n["@type"] === "FAQPage");
    expect(faqNode.mainEntity).toHaveLength(1);
    expect(faqNode.mainEntity[0].acceptedAnswer.text).toMatch(/reducing-balance/);
  });

  it("omits FAQPage when there are no FAQs", () => {
    const { container } = render(
      <ToolJsonLd name="Tool" description="desc" path="/tools/x" />,
    );
    const data = parseLdJson(container);
    const types = data["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).not.toContain("FAQPage");
  });
});
