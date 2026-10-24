"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { calculateEmi, yearlyAmortization, formatINR } from "@/lib/emi";

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

export function EmiCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("10");

  const { result, rows, error } = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate);
    const y = Number(years);
    if (!principal || !rate || !years) return { result: null, rows: [], error: null };
    if (p <= 0) return { result: null, rows: [], error: "Enter a loan amount greater than 0." };
    if (r < 0) return { result: null, rows: [], error: "Interest rate can't be negative." };
    if (y <= 0) return { result: null, rows: [], error: "Enter a tenure greater than 0." };

    const months = Math.round(y * 12);
    return {
      result: calculateEmi({ principal: p, annualRatePercent: r, months }),
      rows: yearlyAmortization({ principal: p, annualRatePercent: r, months }),
      error: null,
    };
  }, [principal, rate, years]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount (₹)" htmlFor="principal">
          <Input
            id="principal"
            type="number"
            min={0}
            inputMode="numeric"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>
        <Field label="Interest rate (% p.a.)" htmlFor="rate">
          <Input
            id="rate"
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Tenure (years)" htmlFor="years">
          <Input
            id="years"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
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
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat value={formatINR(result.emi)} label="Monthly EMI" highlight />
            <Stat value={formatINR(result.totalInterest)} label="Total interest" />
            <Stat value={formatINR(result.totalPayment)} label="Total payable" />
          </div>

          {rows.length > 0 ? (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Yearly breakdown
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 dark:text-slate-400">
                      <th className="py-2 pr-4">Year</th>
                      <th className="py-2 pr-4">Principal paid</th>
                      <th className="py-2 pr-4">Interest paid</th>
                      <th className="py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.month} className="border-t border-slate-100 dark:border-slate-700">
                        <td className="py-2 pr-4">{i + 1}</td>
                        <td className="py-2 pr-4">{formatINR(row.principalPaid)}</td>
                        <td className="py-2 pr-4">{formatINR(row.interestPaid)}</td>
                        <td className="py-2">{formatINR(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
