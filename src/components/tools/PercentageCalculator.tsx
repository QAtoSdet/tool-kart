"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { CopyButton } from "@/components/ui/CopyButton";
import { percentOf, whatPercent, percentChange, trim } from "@/lib/percentage";

/** Every visible string in the calculator, so the Hindi page can reuse the same widget. */
export interface PercentageLabels {
  ofHeading: string;
  percent: string;
  value: string;
  percentOfJoiner: string;
  whatHeading: string;
  x: string;
  y: string;
  ofJoiner: string;
  changeHeading: string;
  from: string;
  to: string;
  toJoiner: string;
  copy: string;
  copied: string;
  copyResult: string;
}

export const ENGLISH_PERCENTAGE_LABELS: PercentageLabels = {
  ofHeading: "What is X% of a number?",
  percent: "Percent",
  value: "Value",
  percentOfJoiner: "% of",
  whatHeading: "X is what percent of Y?",
  x: "X",
  y: "Y",
  ofJoiner: "of",
  changeHeading: "Percentage increase / decrease",
  from: "From",
  to: "To",
  toJoiner: "to",
  copy: "Copy",
  copied: "Copied!",
  copyResult: "Copy result",
};

export function PercentageCalculator({ labels = ENGLISH_PERCENTAGE_LABELS }: { labels?: PercentageLabels }) {
  // Scenario 1: X% of Y
  const [p1, setP1] = useState("15");
  const [v1, setV1] = useState("200");
  // Scenario 2: X is what % of Y
  const [x2, setX2] = useState("30");
  const [y2, setY2] = useState("200");
  // Scenario 3: change from old to new
  const [oldV, setOldV] = useState("200");
  const [newV, setNewV] = useState("250");

  const r1 = percentOf(Number(p1) || 0, Number(v1) || 0);
  const r2 = whatPercent(Number(x2) || 0, Number(y2) || 0);
  const r3 = percentChange(Number(oldV) || 0, Number(newV) || 0);

  // Display strings, reused for rendering and clipboard copy.
  const r1Text = trim(r1);
  const r2Text = r2 === null ? "" : `${trim(r2)}%`;
  const r3Text = r3 === null ? "" : `${r3 > 0 ? "+" : ""}${trim(r3)}%`;

  const copyProps = { label: labels.copy, copiedLabel: labels.copied, "aria-label": labels.copyResult };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">{labels.ofHeading}</h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label={labels.percent} htmlFor="p1">
            <Input id="p1" type="number" className="w-28" value={p1} onChange={(e) => setP1(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">{labels.percentOfJoiner}</span>
          <Field label={labels.value} htmlFor="v1">
            <Input id="v1" type="number" className="w-32" value={v1} onChange={(e) => setV1(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            = <span className="font-bold text-blue-600 dark:text-blue-400">{r1Text}</span>
          </p>
          <CopyButton value={r1Text} {...copyProps} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">{labels.whatHeading}</h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label={labels.x} htmlFor="x2">
            <Input id="x2" type="number" className="w-28" value={x2} onChange={(e) => setX2(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">{labels.ofJoiner}</span>
          <Field label={labels.y} htmlFor="y2">
            <Input id="y2" type="number" className="w-32" value={y2} onChange={(e) => setY2(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            ={" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">{r2 === null ? "—" : r2Text}</span>
          </p>
          <CopyButton value={r2Text} {...copyProps} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">{labels.changeHeading}</h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label={labels.from} htmlFor="oldV">
            <Input id="oldV" type="number" className="w-28" value={oldV} onChange={(e) => setOldV(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">{labels.toJoiner}</span>
          <Field label={labels.to} htmlFor="newV">
            <Input id="newV" type="number" className="w-32" value={newV} onChange={(e) => setNewV(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            ={" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">{r3 === null ? "—" : r3Text}</span>
          </p>
          <CopyButton value={r3Text} {...copyProps} />
        </div>
      </Card>
    </div>
  );
}
