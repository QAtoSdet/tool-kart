"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { calculateEmi, yearlyAmortization, formatINR, type AmortizationRow } from "@/lib/emi";
import { percentOf } from "@/lib/chart";
import { fill } from "@/lib/i18n";
import { SplitBar } from "@/components/charts/SplitBar";
import { StackedColumns } from "@/components/charts/StackedColumns";

const PRINCIPAL_COLOR = "bg-blue-600 dark:bg-blue-500";
const INTEREST_COLOR = "bg-amber-400 dark:bg-amber-500";

/** Every visible string, so the Hindi page can reuse the widget. Templates use {placeholders}. */
export interface EmiLabels {
  loanAmount: string;
  rate: string;
  tenure: string;
  errorAmount: string;
  errorRate: string;
  errorTenure: string;
  monthlyEmi: string;
  totalInterest: string;
  totalPayable: string;
  whereHeading: string;
  splitLabel: string;
  principal: string;
  interest: string;
  eachYearHeading: string;
  yearlyHeading: string;
  year: string;
  principalPaid: string;
  interestPaid: string;
  balance: string;
  /** X-axis label per year, e.g. "Y{n}". */
  yearAxis: string;
  /** Chart summary for a loan under a year: {share}. */
  summaryOne: string;
  /** Chart summary: {years}, {first}, {last}. */
  summaryMany: string;
}

export const ENGLISH_EMI_LABELS: EmiLabels = {
  loanAmount: "Loan amount (₹)",
  rate: "Interest rate (% p.a.)",
  tenure: "Tenure (years)",
  errorAmount: "Enter a loan amount greater than 0.",
  errorRate: "Interest rate can't be negative.",
  errorTenure: "Enter a tenure greater than 0.",
  monthlyEmi: "Monthly EMI",
  totalInterest: "Total interest",
  totalPayable: "Total payable",
  whereHeading: "Where your money goes",
  splitLabel: "Total payable split into principal and interest",
  principal: "Principal",
  interest: "Interest",
  eachYearHeading: "Each year's payments",
  yearlyHeading: "Yearly breakdown",
  year: "Year",
  principalPaid: "Principal paid",
  interestPaid: "Interest paid",
  balance: "Balance",
  yearAxis: "Y{n}",
  summaryOne: "Chart of yearly payments: {share}% of what you pay goes to interest.",
  summaryMany:
    "Chart of yearly payments split into principal and interest over {years} years. In year 1, {first}% of what you pay goes to interest; by the final year it is {last}%.",
};

/** Screen-reader summary of the yearly chart: how the interest share falls over the loan. */
export function emiChartSummary(rows: AmortizationRow[], labels: EmiLabels = ENGLISH_EMI_LABELS): string {
  const share = (r: AmortizationRow) => percentOf(r.interestPaid, r.interestPaid + r.principalPaid);
  const first = rows[0];
  const last = rows[rows.length - 1];
  if (rows.length === 1) return fill(labels.summaryOne, { share: share(first) });
  return fill(labels.summaryMany, { years: rows.length, first: share(first), last: share(last) });
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

export function EmiCalculator({ labels = ENGLISH_EMI_LABELS }: { labels?: EmiLabels }) {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("10");

  const { result, rows, error } = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate);
    const y = Number(years);
    if (!principal || !rate || !years) return { result: null, rows: [], error: null };
    if (p <= 0) return { result: null, rows: [], error: labels.errorAmount };
    if (r < 0) return { result: null, rows: [], error: labels.errorRate };
    if (y <= 0) return { result: null, rows: [], error: labels.errorTenure };

    const months = Math.round(y * 12);
    return {
      result: calculateEmi({ principal: p, annualRatePercent: r, months }),
      rows: yearlyAmortization({ principal: p, annualRatePercent: r, months }),
      error: null,
    };
  }, [principal, rate, years, labels]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={labels.loanAmount} htmlFor="principal">
          <Input
            id="principal"
            type="number"
            min={0}
            inputMode="numeric"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>
        <Field label={labels.rate} htmlFor="rate">
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
        <Field label={labels.tenure} htmlFor="years">
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
            <Stat value={formatINR(result.emi)} label={labels.monthlyEmi} highlight />
            <Stat value={formatINR(result.totalInterest)} label={labels.totalInterest} />
            <Stat value={formatINR(result.totalPayment)} label={labels.totalPayable} />
          </div>

          {rows.length > 0 ? (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{labels.whereHeading}</h2>
              <SplitBar
                label={labels.splitLabel}
                segments={[
                  { label: labels.principal, value: Number(principal), colorClass: PRINCIPAL_COLOR },
                  { label: labels.interest, value: result.totalInterest, colorClass: INTEREST_COLOR },
                ]}
              />
              <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {labels.eachYearHeading}
              </h3>
              <StackedColumns
                summary={emiChartSummary(rows, labels)}
                series={[
                  { name: labels.principal, colorClass: PRINCIPAL_COLOR },
                  { name: labels.interest, colorClass: INTEREST_COLOR },
                ]}
                columns={rows.map((row, i) => ({
                  label: fill(labels.yearAxis, { n: i + 1 }),
                  values: [row.principalPaid, row.interestPaid],
                }))}
              />
            </Card>
          ) : null}

          {rows.length > 0 ? (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{labels.yearlyHeading}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 dark:text-slate-400">
                      <th className="py-2 pr-4">{labels.year}</th>
                      <th className="py-2 pr-4">{labels.principalPaid}</th>
                      <th className="py-2 pr-4">{labels.interestPaid}</th>
                      <th className="py-2">{labels.balance}</th>
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
