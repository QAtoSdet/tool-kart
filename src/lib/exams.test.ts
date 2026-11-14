import { describe, it, expect } from "vitest";
import { EXAMS, getExamBySlug, getExamRoutes, sizeRange } from "./exams";

describe("exam registry", () => {
  it("has unique slugs and unique upload ids within each exam", () => {
    expect(new Set(EXAMS.map((e) => e.slug)).size).toBe(EXAMS.length);
    for (const e of EXAMS) expect(new Set(e.uploads.map((u) => u.id)).size).toBe(e.uploads.length);
  });

  it("gives every uploadable item a valid KB range, and live captures none", () => {
    for (const e of EXAMS) {
      for (const u of e.uploads) {
        if (u.uploadable) {
          expect(u.maxKb, `${e.slug}/${u.id}`).toBeGreaterThan(0);
          expect(u.minKb ?? 0, `${e.slug}/${u.id}`).toBeLessThan(u.maxKb!);
        } else {
          expect(u.maxKb, `${e.slug}/${u.id}`).toBeUndefined();
        }
        expect(u.rules.length, `${e.slug}/${u.id}`).toBeGreaterThan(0);
      }
      expect(e.uploads.some((u) => u.uploadable), e.slug).toBe(true);
    }
  });

  it("records an https source and a valid check date for every exam", () => {
    for (const e of EXAMS) {
      expect(e.sources.length, e.slug).toBeGreaterThan(0);
      for (const s of e.sources) expect(s.url, e.slug).toMatch(/^https:\/\//);
      expect(e.lastChecked, e.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(e.lastChecked))).toBe(false);
      expect(e.faqs.length, e.slug).toBeGreaterThan(0);
    }
  });

  it("builds /exams/<slug> routes", () => {
    expect(getExamRoutes()).toContain("/exams/upsc-photo-signature-size");
  });

  it("formats size ranges", () => {
    expect(sizeRange({ id: "x", label: "x", minKb: 10, maxKb: 20, uploadable: true, rules: ["r"] })).toBe("10–20 KB");
    expect(sizeRange({ id: "x", label: "x", maxKb: 50, uploadable: true, rules: ["r"] })).toBe("up to 50 KB");
    expect(sizeRange({ id: "x", label: "x", uploadable: false, rules: ["r"] })).toBeNull();
  });
});

/**
 * The official figures, as read from each source on 2026-11-14. If a test here fails, someone
 * changed a limit: only do that after reading the exam's new official notice, then update the
 * figure, the page's sources and `lastChecked` together.
 */
describe("official figures (checked 2026-11-14)", () => {
  const range = (slug: string, id: string) => {
    const u = getExamBySlug(slug)!.uploads.find((x) => x.id === id)!;
    return [u.minKb, u.maxKb, u.uploadable];
  };

  it("SSC CGL 2026: live photo, signature 10–20 KB", () => {
    expect(range("ssc-cgl-photo-signature-size", "photo")).toEqual([undefined, undefined, false]);
    expect(range("ssc-cgl-photo-signature-size", "signature")).toEqual([10, 20, true]);
  });

  it("UPSC: photo 20–200 KB, live photo, triple signature 20–100 KB", () => {
    expect(range("upsc-photo-signature-size", "photo")).toEqual([20, 200, true]);
    expect(range("upsc-photo-signature-size", "live-photo")).toEqual([undefined, undefined, false]);
    expect(range("upsc-photo-signature-size", "signature")).toEqual([20, 100, true]);
  });

  it("IBPS/SBI: photo 20–50, signature 10–20, thumb 20–50, declaration 50–100 KB", () => {
    const s = "ibps-sbi-photo-signature-size";
    expect(range(s, "photo")).toEqual([20, 50, true]);
    expect(range(s, "signature")).toEqual([10, 20, true]);
    expect(range(s, "thumb")).toEqual([20, 50, true]);
    expect(range(s, "declaration")).toEqual([50, 100, true]);
  });

  it("NEET UG 2026: photo 10–200, signature 10–100, impressions 50–200 KB (satisfies both bulletin ranges)", () => {
    const s = "neet-ug-photo-signature-size";
    expect(range(s, "photo")).toEqual([10, 200, true]);
    expect(range(s, "signature")).toEqual([10, 100, true]);
    const [min, max] = range(s, "fingers") as number[];
    // Bulletin gives 10–200 KB in one section and 50–300 KB in another.
    expect(min).toBeGreaterThanOrEqual(50);
    expect(max).toBeLessThanOrEqual(200);
  });
});
