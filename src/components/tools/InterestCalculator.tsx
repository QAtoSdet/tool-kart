"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import {
  compoundInterest,
  growthSchedule,
  simpleInterest,
  validateInterestInput,
  type Compounding,
} from "@/lib/interest";
import { formatINR } from "@/lib/sip";

const COMPOUNDING_OPTIONS: { value: Compounding; label: string }[] = [
  { value: "yearly", label: "Yearly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "quarterly", label: "Quarterly (most bank FDs)" },
  { value: "monthly", label: "Monthly" },
];

function formatYears(t: number) {
  const y = Math.floor(t);
  const m = Math.round((t - y) * 12);
  if (m === 0) return `${y} yr`;
  return y === 0 ? `${m} mo` : `${y} yr ${m} mo`;
}

function ResultCard({ title, interest, total, highlight }: { title: string; interest: number; total: number; highlight?: boolean }) {
  return (
    <div
      className={
        "rounded-lg p-4 " +
        (highlight
          ? "border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
          : "bg-slate-50 dark:bg-slate-800/60")
      }
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600 dark:text-slate-400">Interest</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{formatINR(interest)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600 dark:text-slate-400">Total amount</dt>
          <dd className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatINR(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function InterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [months, setMonths] = useState("0");
  const [compounding, setCompounding] = useState<Compounding>("yearly");

  const { data, error } = useMemo(() => {
    const input = {
      principal: Number(principal),
      ratePercent: Number(rate),
      years: Number(years || 0),
      months: Number(months || 0),
    };
    if (!principal || !rate) return { data: null, error: null };
    const err = validateInterestInput(input);
    if (err) return { data: null, error: err };
    const t = input.years + input.months / 12;
    const si = simpleInterest(input.principal, input.ratePercent, t);
    const ci = compoundInterest(input.principal, input.ratePercent, t, compounding);
    return {
      data: { t, si, ci, schedule: growthSchedule(input.principal, input.ratePercent, t, compounding) },
      error: null,
    };
  }, [principal, rate, years, months, compounding]);

  const extra = data ? Math.round(data.ci.interest) - Math.round(data.si.interest) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Principal amount (₹)" htmlFor="int-principal">
          <Input
            id="int-principal"
            type="number"
            min={0}
            inputMode="numeric"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>
        <Field label="Interest rate (% per year)" htmlFor="int-rate">
          <Input
            id="int-rate"
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Years" htmlFor="int-years">
            <Input
              id="int-years"
              type="number"
              min={0}
              max={50}
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </Field>
          <Field label="Months" htmlFor="int-months">
            <Input
              id="int-months"
              type="number"
              min={0}
              max={11}
              inputMode="numeric"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Compounding" htmlFor="int-compounding" hint="Applies to compound interest only.">
          <Select
            id="int-compounding"
            value={compounding}
            onChange={(e) => setCompounding(e.target.value as Compounding)}
          >
            {COMPOUNDING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard title="Simple interest" interest={data.si.interest} total={data.si.total} />
            <ResultCard title="Compound interest" interest={data.ci.interest} total={data.ci.total} highlight />
          </div>
          <p role="status" className="text-center text-sm text-slate-700 dark:text-slate-200">
            {extra > 0 ? (
              <>
                Compounding earns <strong>{formatINR(extra)}</strong> more than simple interest over{" "}
                {formatYears(data.t)}.
              </>
            ) : (
              <>Simple and compound interest come out the same here.</>
            )}
          </p>

          {/* Focusable so keyboard users can scroll long schedules with the arrow keys. */}
          <div
            role="region"
            aria-label="Year-by-year balance"
            tabIndex={0}
            className="max-h-80 overflow-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700"
          >
            <table className="w-full text-sm">
              <caption className="sr-only">Balance over time with simple and compound interest</caption>
              <thead className="sticky top-0 bg-white dark:bg-slate-900">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th scope="col" className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
                    After
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">
                    Simple
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">
                    Compound
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.schedule.map((row) => (
                  <tr key={row.years}>
                    <th scope="row" className="px-3 py-1.5 text-left font-normal text-slate-600 dark:text-slate-400">
                      {formatYears(row.years)}
                    </th>
                    <td className="px-3 py-1.5 text-right text-slate-900 dark:text-white">{formatINR(row.simpleTotal)}</td>
                    <td className="px-3 py-1.5 text-right text-slate-900 dark:text-white">{formatINR(row.compoundTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Results are before tax. For tenures that aren&apos;t a whole number of compounding periods,
        banks may calculate the last part-period differently, so treat the figure as a close
        estimate.
      </p>
    </div>
  );
}
