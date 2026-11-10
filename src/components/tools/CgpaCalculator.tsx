"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import { CopyButton } from "@/components/ui/CopyButton";
import { CGPA_FORMULAS, cgpaToPercentage, getFormula } from "@/lib/cgpa";

const CUSTOM = "custom";

const trim = (n: number) => String(Math.round(n * 100) / 100);

export function CgpaCalculator() {
  const [cgpa, setCgpa] = useState("8.2");
  const [formulaId, setFormulaId] = useState(CGPA_FORMULAS[0].id);
  const [customOffset, setCustomOffset] = useState("0");
  const [customMultiplier, setCustomMultiplier] = useState("10");

  const isCustom = formulaId === CUSTOM;
  const preset = getFormula(formulaId);
  const offset = isCustom ? Number(customOffset) : preset!.offset;
  const multiplier = isCustom ? Number(customMultiplier) : preset!.multiplier;
  const formulaText = isCustom
    ? offset > 0
      ? `(CGPA − ${trim(offset)}) × ${trim(multiplier)}`
      : `CGPA × ${trim(multiplier)}`
    : preset!.formula;

  const result = useMemo(
    () => (cgpa.trim() === "" ? null : cgpaToPercentage(Number(cgpa), offset, multiplier)),
    [cgpa, offset, multiplier],
  );
  const percentText = result?.ok ? `${result.percentage}%` : "";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your CGPA (out of 10)" htmlFor="cgpa">
          <Input
            id="cgpa"
            type="number"
            min={0}
            max={10}
            step="0.01"
            inputMode="decimal"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
          />
        </Field>
        <Field label="Board or university" htmlFor="cgpa-formula">
          <Select id="cgpa-formula" value={formulaId} onChange={(e) => setFormulaId(e.target.value)}>
            {CGPA_FORMULAS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
            <option value={CUSTOM}>Other — enter my university&apos;s formula</option>
          </Select>
        </Field>
      </div>

      {isCustom ? (
        <div className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-2 dark:border-slate-700">
          <p className="text-sm text-slate-600 sm:col-span-2 dark:text-slate-400">
            Use the formula printed on your marksheet or in your university&apos;s regulations, in the
            form (CGPA − subtract) × multiply.
          </p>
          <Field label="Subtract from CGPA" htmlFor="cgpa-offset" hint="Use 0 if there is none.">
            <Input
              id="cgpa-offset"
              type="number"
              min={0}
              step="0.05"
              inputMode="decimal"
              value={customOffset}
              onChange={(e) => setCustomOffset(e.target.value)}
            />
          </Field>
          <Field label="Multiply by" htmlFor="cgpa-multiplier">
            <Input
              id="cgpa-multiplier"
              type="number"
              min={0}
              step="0.1"
              inputMode="decimal"
              value={customMultiplier}
              onChange={(e) => setCustomMultiplier(e.target.value)}
            />
          </Field>
        </div>
      ) : null}

      {result && !result.ok ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {result.error}
        </p>
      ) : null}

      {result?.ok ? (
        <div className="rounded-lg bg-slate-50 p-5 text-center dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">Equivalent percentage</p>
          <p
            role="status"
            className="mt-1 text-4xl font-bold text-blue-600 dark:text-blue-400"
          >
            {percentText}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {formulaText.replace("CGPA", cgpa)} = {percentText}
          </p>
          {!isCustom ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Source: {preset!.source}
            </p>
          ) : null}
          <div className="mt-3 flex justify-center">
            <CopyButton value={percentText} label="Copy percentage" />
          </div>
        </div>
      ) : null}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        If your marksheet or college states a different formula, that one is what counts. Autonomous
        colleges sometimes follow their own rules.
      </p>
    </div>
  );
}
