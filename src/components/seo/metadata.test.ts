import { describe, it, expect } from "vitest";
import { buildMetadata } from "./metadata";

describe("buildMetadata", () => {
  it("sets title, description and canonical", () => {
    const meta = buildMetadata({
      title: "EMI Calculator",
      description: "Calculate your loan EMI.",
      path: "/tools/emi-calculator",
    });
    expect(meta.title).toBe("EMI Calculator");
    expect(meta.description).toBe("Calculate your loan EMI.");
    expect(meta.alternates?.canonical).toContain("/tools/emi-calculator");
  });

  it("builds Open Graph with the site-suffixed title and a url", () => {
    const meta = buildMetadata({
      title: "QR Code Generator",
      description: "Make QR codes.",
      path: "/tools/qr-code-generator",
    });
    expect(meta.openGraph?.title).toContain("QR Code Generator");
    // openGraph.url is typed as string | URL; assert it contains the path.
    expect(String(meta.openGraph?.url)).toContain("/tools/qr-code-generator");
  });
});
