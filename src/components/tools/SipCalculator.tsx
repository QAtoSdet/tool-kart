"use client";

import { useMemo, useState } from "react";
import { Field, Input } from "@/components/ui/Input";
import { calculateSip, formatINR } from "@/lib/sip";

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
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Estimates assume a constant annual return compounded monthly. Actual mutual-fund returns
        vary and are not guaranteed.
      </p>
    </div>
  );
}
