import { describe, it, expect } from "vitest";
import { CGPA_FORMULAS, cgpaToPercentage, getFormula } from "./cgpa";

const convert = (id: string, cgpa: number) => {
  const f = getFormula(id)!;
  return cgpaToPercentage(cgpa, f.offset, f.multiplier);
};
const pct = (id: string, cgpa: number) => {
  const r = convert(id, cgpa);
  if (!r.ok) throw new Error(r.error);
  return r.percentage;
};

describe("CGPA to percentage", () => {
  // Expected values are the worked examples published alongside each formula.
  it("CBSE: CGPA × 9.5 (8.4 → 79.8%, 8.0 → 76%, 10 → 95%)", () => {
    expect(pct("cbse", 8.4)).toBe(79.8);
    expect(pct("cbse", 8)).toBe(76);
    expect(pct("cbse", 10)).toBe(95);
  });

  it("VTU: 8.2 is 82% on the 2022 scheme but 74.5% on 2015–2021", () => {
    expect(pct("vtu-2022", 8.2)).toBe(82);
    expect(pct("vtu-2015-2021", 8.2)).toBe(74.5);
  });

  it("GTU: (CGPA − 0.5) × 10 (7.62 → 71.2%)", () => {
    expect(pct("gtu", 7.62)).toBe(71.2);
  });

  it("Anna University: CGPA × 10", () => {
    expect(pct("anna", 8.35)).toBe(83.5);
  });

  // Figures quoted in the "how to convert CGPA to percentage" guide.
  it("matches the guide's 8.2 comparison", () => {
    expect([pct("cbse", 8.2), pct("vtu-2022", 8.2), pct("vtu-2015-2021", 8.2), pct("gtu", 8.2)])
      .toEqual([77.9, 82, 74.5, 77]);
  });

  it("avoids floating-point noise", () => {
    expect(pct("cbse", 7.3)).toBe(69.35); // 7.3 × 9.5 = 69.35, not 69.34999…
  });

  it("clamps to 0–100 (a low CGPA can't go negative with an offset)", () => {
    expect(pct("vtu-2015-2021", 0.5)).toBe(0);
    expect(cgpaToPercentage(10, 0, 11)).toEqual({ ok: true, percentage: 100 });
  });

  it("supports a custom formula", () => {
    expect(cgpaToPercentage(8, 0.5, 10)).toEqual({ ok: true, percentage: 75 });
  });

  it.each([-1, 10.1, NaN])("rejects an out-of-range CGPA (%s)", (cgpa) => {
    expect(cgpaToPercentage(cgpa, 0, 9.5).ok).toBe(false);
  });

  it("rejects an invalid custom formula", () => {
    expect(cgpaToPercentage(8, 0, 0).ok).toBe(false);
    expect(cgpaToPercentage(8, -1, 10).ok).toBe(false);
  });

  it("every formula has a source and a unique id", () => {
    const ids = CGPA_FORMULAS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of CGPA_FORMULAS) expect(f.source.length).toBeGreaterThan(0);
  });
});
