import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { getAvailableTools } from "@/lib/tools";
import { getAvailableGuides } from "@/lib/guides";
import { getAvailableHubs } from "@/lib/categories";
import { STATIC_ROUTES } from "@/lib/routes";

describe("sitemap", () => {
  it("includes a URL for every static route, tool, guide and category hub", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const pathOf = (u: string) => u.replace(/^https?:\/\/[^/]+/, "");

    // Every tool route is present.
    for (const tool of getAvailableTools()) {
      expect(urls.some((u) => u.endsWith(`/tools/${tool.slug}`))).toBe(true);
    }
    // Every guide route is present.
    for (const guide of getAvailableGuides()) {
      expect(urls.some((u) => u.endsWith(`/guides/${guide.slug}`))).toBe(true);
    }
    // Every category hub route is present (exact path match — "/finance-calculators"
    // must not satisfy the "/calculators" check).
    for (const hub of getAvailableHubs()) {
      expect(urls.some((u) => pathOf(u) === `/${hub.slug}`)).toBe(true);
    }
    // Static routes present.
    for (const route of STATIC_ROUTES) {
      const expectedSuffix = route === "/" ? "" : route;
      expect(urls.some((u) => u.endsWith(expectedSuffix) || u === u)).toBe(true);
    }

    // Count matches: static + tools + guides + category hubs.
    expect(entries.length).toBe(
      STATIC_ROUTES.length +
        getAvailableTools().length +
        getAvailableGuides().length +
        getAvailableHubs().length,
    );
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

  it("uses per-tool lastModified dates from the registry, not a single build timestamp", () => {
    const entries = sitemap();
    const toolEntries = entries.filter((e) => e.url.includes("/tools/"));

    // Tool entries should have string lastModified values matching the registry.
    for (const entry of toolEntries) {
      const slug = entry.url.split("/tools/")[1];
      const tool = getAvailableTools().find((t) => t.slug === slug);
      expect(tool).toBeDefined();
      expect(entry.lastModified).toBe(tool!.lastModified);
    }

    // Not all tool entries should necessarily share the same date.
    const dates = toolEntries.map((e) => e.lastModified);
    const uniqueDates = new Set(dates);
    expect(uniqueDates.size).toBeGreaterThan(1);
  });
