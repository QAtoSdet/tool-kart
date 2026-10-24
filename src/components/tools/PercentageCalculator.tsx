"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { percentOf, whatPercent, percentChange, trim } from "@/lib/percentage";

export function PercentageCalculator() {
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

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
          What is X% of a number?
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Percent" htmlFor="p1">
            <Input id="p1" type="number" className="w-28" value={p1} onChange={(e) => setP1(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">% of</span>
          <Field label="Value" htmlFor="v1">
            <Input id="v1" type="number" className="w-32" value={v1} onChange={(e) => setV1(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            = <span className="font-bold text-blue-600 dark:text-blue-400">{trim(r1)}</span>
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
          X is what percent of Y?
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="X" htmlFor="x2">
            <Input id="x2" type="number" className="w-28" value={x2} onChange={(e) => setX2(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">of</span>
          <Field label="Y" htmlFor="y2">
            <Input id="y2" type="number" className="w-32" value={y2} onChange={(e) => setY2(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            ={" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {r2 === null ? "—" : `${trim(r2)}%`}
            </span>
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
          Percentage increase / decrease
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="From" htmlFor="oldV">
            <Input id="oldV" type="number" className="w-28" value={oldV} onChange={(e) => setOldV(e.target.value)} />
          </Field>
          <span className="pb-2.5 text-slate-500">to</span>
          <Field label="To" htmlFor="newV">
            <Input id="newV" type="number" className="w-32" value={newV} onChange={(e) => setNewV(e.target.value)} />
          </Field>
          <p className="pb-2 text-slate-700 dark:text-slate-200">
            ={" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {r3 === null ? "—" : `${r3 > 0 ? "+" : ""}${trim(r3)}%`}
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
