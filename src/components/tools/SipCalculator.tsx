"use client";

import { useMemo, useState } from "react";
import { Field, Input } from "@/components/ui/Input";
import { calculateSip, formatINR, sipYearlySchedule, type SipYear } from "@/lib/sip";
import { Card } from "@/components/ui/Card";
import { GrowthChart } from "@/components/charts/GrowthChart";

const yearsLabel = (y: number) => {
  const whole = Math.floor(y);
  const months = Math.round((y - whole) * 12);
  if (months === 0) return `${whole} yr`;
  return whole === 0 ? `${months} mo` : `${whole} yr ${months} mo`;
};

/** Screen-reader summary of the growth chart. */
export function sipChartSummary(schedule: SipYear[]): string {
  const last = schedule[schedule.length - 1];
  const half = schedule[Math.floor((schedule.length - 1) / 2)];
  const base = `Chart of SIP growth: after ${yearsLabel(last.years)}, ${formatINR(last.invested)} invested grows to an estimated ${formatINR(last.value)}.`;
  if (schedule.length <= 2) return base;
  const halfway = `${base} Halfway, after ${yearsLabel(half.years)}, it is ${formatINR(half.value)}`;
  // Only claim back-loaded growth when compounding actually makes it so (not at a 0% return).
  return half.value < last.value * 0.45
    ? `${halfway}, so most of the growth comes in the later years.`
    : `${halfway}.`;
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/60">
      <div
        className={
          "text-xl font-bold " +
          (highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")
        }
      >
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function SipCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const { result, error } = useMemo(() => {
    const m = Number(monthly);
    const r = Number(rate);
    const y = Number(years);
    if (!monthly || !rate || !years) return { result: null, error: null };
    if (m <= 0) return { result: null, error: "Enter a monthly investment greater than 0." };
    if (y <= 0) return { result: null, error: "Enter a duration greater than 0." };
    return {
      result: calculateSip({ monthlyInvestment: m, annualRatePercent: r, years: y }),
      error: null,
    };
  }, [monthly, rate, years]);

  const schedule = useMemo(
    () =>
      result
        ? sipYearlySchedule({
            monthlyInvestment: Number(monthly),
            annualRatePercent: Number(rate),
            years: Number(years),
          })
        : [],
    [result, monthly, rate, years],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Monthly investment (₹)" htmlFor="monthly">
          <Input
            id="monthly"
            type="number"
            min={0}
            inputMode="numeric"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
          />
        </Field>
        <Field label="Expected return (% p.a.)" htmlFor="rate">
          <Input
            id="rate"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Duration (years)" htmlFor="years">
          <Input
            id="years"
            type="number"
            min={0}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat value={formatINR(result.investedAmount)} label="Invested amount" />
          <Stat value={formatINR(result.estimatedReturns)} label="Estimated returns" />
          <Stat value={formatINR(result.futureValue)} label="Total value" highlight />
        </div>
      ) : null}

      {result && schedule.length > 0 ? (
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Growth over time</h2>
          <GrowthChart
            summary={sipChartSummary(schedule)}
            formatX={(x) => (x === 0 ? "0" : yearsLabel(x))}
            series={[
              {
                name: "Total value",
                strokeClass: "stroke-blue-600 dark:stroke-blue-400",
                fillClass: "fill-blue-500/15 dark:fill-blue-400/15",
                swatchClass: "bg-blue-600 dark:bg-blue-400",
              },
              {
                name: "Amount invested",
                strokeClass: "stroke-slate-500 dark:stroke-slate-400",
                swatchClass: "bg-slate-500 dark:bg-slate-400",
                dashed: true,
              },
            ]}
            points={schedule.map((p) => ({ x: p.years, values: [p.value, p.invested] }))}
          />
        </Card>
      ) : null}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Estimates assume a constant annual return compounded monthly. Actual mutual-fund returns
        vary and are not guaranteed.
      </p>
    </div>
  );
}
