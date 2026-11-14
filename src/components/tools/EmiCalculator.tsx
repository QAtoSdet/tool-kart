"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { calculateEmi, yearlyAmortization, formatINR, type AmortizationRow } from "@/lib/emi";
import { percentOf } from "@/lib/chart";
import { SplitBar } from "@/components/charts/SplitBar";
import { StackedColumns } from "@/components/charts/StackedColumns";

const PRINCIPAL_COLOR = "bg-blue-600 dark:bg-blue-500";
const INTEREST_COLOR = "bg-amber-400 dark:bg-amber-500";

/** Screen-reader summary of the yearly chart: how the interest share falls over the loan. */
export function emiChartSummary(rows: AmortizationRow[]): string {
  const share = (r: AmortizationRow) => percentOf(r.interestPaid, r.interestPaid + r.principalPaid);
  const first = rows[0];
  const last = rows[rows.length - 1];
  if (rows.length === 1) {
    return `Chart of yearly payments: ${share(first)}% of what you pay goes to interest.`;
  }
  return `Chart of yearly payments split into principal and interest over ${rows.length} years. In year 1, ${share(first)}% of what you pay goes to interest; by the final year it is ${share(last)}%.`;
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
                Where your money goes
              </h2>
              <SplitBar
                label="Total payable split into principal and interest"
                segments={[
                  { label: "Principal", value: Number(principal), colorClass: PRINCIPAL_COLOR },
                  { label: "Interest", value: result.totalInterest, colorClass: INTEREST_COLOR },
                ]}
              />
              <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Each year&apos;s payments
              </h3>
              <StackedColumns
                summary={emiChartSummary(rows)}
                series={[
                  { name: "Principal", colorClass: PRINCIPAL_COLOR },
                  { name: "Interest", colorClass: INTEREST_COLOR },
                ]}
                columns={rows.map((row, i) => ({
                  label: `Y${i + 1}`,
                  values: [row.principalPaid, row.interestPaid],
                }))}
              />
            </Card>
          ) : null}

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
