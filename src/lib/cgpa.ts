/**
 * CGPA → percentage conversion for Indian boards and universities. Pure and tested.
 *
 * Every formula here has the shape  percentage = (CGPA − offset) × multiplier,
 * which covers both forms universities use ("CGPA × 9.5" and "(CGPA − 0.5) × 10").
 *
 * Only formulas traceable to an official document are listed. Add a new one only with a
 * source — a wrong formula on a job or admission form can cost a student.
 */

export interface CgpaFormula {
  id: string;
  /** Name shown in the selector. */
  label: string;
  offset: number;
  multiplier: number;
  /** Human-readable formula, e.g. "CGPA × 9.5". */
  formula: string;
  /** Where the formula comes from (shown to the user). */
  source: string;
}

export const CGPA_FORMULAS: CgpaFormula[] = [
  {
    id: "cbse",
    label: "CBSE (Class 10 / 12)",
    offset: 0,
    multiplier: 9.5,
    formula: "CGPA × 9.5",
    source: "CBSE Circular No. 24 (2010)",
  },
  {
    id: "vtu-2022",
    label: "VTU — 2022 scheme (codes starting with B)",
    offset: 0,
    multiplier: 10,
    formula: "CGPA × 10",
    source: "VTU B.E./B.Tech 2022 regulations",
  },
  {
    id: "vtu-2015-2021",
    label: "VTU — 2015 to 2021 schemes",
    offset: 0.75,
    multiplier: 10,
    formula: "(CGPA − 0.75) × 10",
    source: "VTU B.E./B.Tech regulations (2015–2021 schemes)",
  },
  {
    id: "gtu",
    label: "GTU (Gujarat Technological University)",
    offset: 0.5,
    multiplier: 10,
    formula: "(CGPA − 0.5) × 10",
    source: "GTU Academic Council Notification 1/2012",
  },
  {
    id: "anna",
    label: "Anna University",
    offset: 0,
    multiplier: 10,
    formula: "CGPA × 10",
    source: "Anna University, Office of the Controller of Examinations",
  },
];

export function getFormula(id: string): CgpaFormula | undefined {
  return CGPA_FORMULAS.find((f) => f.id === id);
}

export const MAX_CGPA = 10;

export type CgpaResult = { ok: true; percentage: number } | { ok: false; error: string };

/** Convert a CGPA (0–10) to a percentage, clamped to 0–100 and rounded to 2 decimals. */
export function cgpaToPercentage(cgpa: number, offset: number, multiplier: number): CgpaResult {
  if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > MAX_CGPA) {
    return { ok: false, error: `Enter a CGPA between 0 and ${MAX_CGPA}.` };
  }
  if (!Number.isFinite(multiplier) || multiplier <= 0 || !Number.isFinite(offset) || offset < 0) {
    return { ok: false, error: "Enter a valid formula (multiplier above 0, offset 0 or more)." };
  }
  const raw = (cgpa - offset) * multiplier;
  const clamped = Math.min(100, Math.max(0, raw));
  return { ok: true, percentage: Math.round(clamped * 100) / 100 };
}
