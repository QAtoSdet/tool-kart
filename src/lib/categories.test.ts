import { describe, it, expect } from "vitest";
import {
  CATEGORY_HUBS,
  getAvailableHubs,
  getHubByCategory,
  getHubBySlug,
  getHubRoutes,
} from "./categories";
import { getAvailableTools } from "./tools";

describe("category hubs registry", () => {
  it("has unique slugs and unique categories", () => {
    const slugs = CATEGORY_HUBS.map((h) => h.slug);
    const cats = CATEGORY_HUBS.map((h) => h.category);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("has a hub for every category that has an available tool", () => {
    // Guards against adding a tool in a new category and forgetting its hub.
    for (const tool of getAvailableTools()) {
      expect(getHubByCategory(tool.category), `no hub for ${tool.category}`).toBeDefined();
    }
  });

  it("does not collide with existing top-level routes", () => {
    const reserved = ["tools", "guides", "exams", "about", "contact", "privacy", "terms"];
    for (const hub of getAvailableHubs()) {
      expect(reserved).not.toContain(hub.slug);
    }
  });

  it("looks up hubs by slug and exposes site-relative routes", () => {
    expect(getHubBySlug("finance-calculators")?.category).toBe("Finance");
    expect(getHubBySlug("nope")).toBeUndefined();
    expect(getHubRoutes()).toContain("/finance-calculators");
    expect(getHubRoutes().every((r) => r.startsWith("/"))).toBe(true);
  });
});
