import { describe, it, expect } from "vitest";
import {
  TOOLS,
  getAvailableTools,
  getToolBySlug,
  getToolsByCategory,
} from "./tools";

describe("tools registry", () => {
  it("has unique slugs", () => {
    const slugs = TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("returns only available tools", () => {
    const available = getAvailableTools();
    expect(available.every((t) => t.available)).toBe(true);
  });

  it("looks up a tool by slug", () => {
    expect(getToolBySlug("emi-calculator")?.name).toBe("EMI Calculator");
    expect(getToolBySlug("does-not-exist")).toBeUndefined();
  });

  it("groups tools by category without losing any", () => {
    const grouped = getToolsByCategory();
    const total = grouped.reduce((sum, g) => sum + g.tools.length, 0);
    expect(total).toBe(getAvailableTools().length);
  });
});
