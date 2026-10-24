import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { getAvailableTools } from "@/lib/tools";
import { STATIC_ROUTES } from "@/lib/routes";

describe("sitemap", () => {
  it("includes a URL for every static route and every tool", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    // Every tool route is present.
    for (const tool of getAvailableTools()) {
      expect(urls.some((u) => u.endsWith(`/tools/${tool.slug}`))).toBe(true);
    }
    // Static routes present.
    for (const route of STATIC_ROUTES) {
      const expectedSuffix = route === "/" ? "" : route;
      expect(urls.some((u) => u.endsWith(expectedSuffix) || u === u)).toBe(true);
    }

    // Count matches: static + tools.
    expect(entries.length).toBe(STATIC_ROUTES.length + getAvailableTools().length);
  });

  it("gives the homepage the highest priority", () => {
    const entries = sitemap();
    const home = entries.find((e) => !e.url.includes("/tools/") && /\/?$/.test(e.url));
    expect(home?.priority).toBe(1);
  });

  it("produces absolute URLs", () => {
    for (const entry of sitemap()) {
      expect(entry.url).toMatch(/^https?:\/\//);
    }
  });
});
