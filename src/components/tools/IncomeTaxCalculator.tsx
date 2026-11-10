"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import { compareRegimes, type AgeGroup, type RegimeResult } from "@/lib/income-tax";
import { formatINR } from "@/lib/sip";

const ROWS: { key: keyof RegimeResult; label: string }[] = [
  { key: "taxableIncome", label: "Taxable income" },
  { key: "taxBeforeRebate", label: "Tax on slabs" },
  { key: "rebate", label: "Rebate (Sec 87A)" },
  { key: "surcharge", label: "Surcharge" },
  { key: "cess", label: "Health & education cess (4%)" },
];

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState("1500000");
  const [salaried, setSalaried] = useState(true);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("below60");
  const [deductions, setDeductions] = useState("150000");

  const { result, error } = useMemo(() => {
    const gross = Number(income);
    const ded = Number(deductions || 0);
    if (!income) return { result: null, error: null };
    if (Number.isNaN(gross) || gross < 0) {
      return { result: null, error: "Enter a valid annual income." };
    }
    if (Number.isNaN(ded) || ded < 0) {
      return { result: null, error: "Enter valid deductions (or 0)." };
    }
    return {
      result: compareRegimes({ grossIncome: gross, salaried, ageGroup, oldRegimeDeductions: ded }),
      error: null,
    };
  }, [income, salaried, ageGroup, deductions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Annual income (₹)" htmlFor="it-income" hint="Gross yearly income before tax.">
          <Input
            id="it-income"
            type="number"
            min={0}
            inputMode="numeric"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </Field>
        <Field label="Age" htmlFor="it-age" hint="Changes old-regime exemption only.">
          <Select
            id="it-age"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
          >
            <option value="below60">Below 60</option>
            <option value="60to80">60 to 80 (senior)</option>
            <option value="above80">Above 80 (super senior)</option>
          </Select>
        </Field>
        <Field
          label="Old-regime deductions (₹)"
          htmlFor="it-deductions"
          hint="80C, 80D, HRA, home-loan interest etc. Not allowed in the new regime."
        >
          <Input
            id="it-deductions"
            type="number"
            min={0}
            inputMode="numeric"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-2 sm:pt-7">
          <input
            id="it-salaried"
            type="checkbox"
            checked={salaried}
            onChange={(e) => setSalaried(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          <label htmlFor="it-salaried" className="text-sm text-slate-700 dark:text-slate-200">
            Salaried / pensioner (standard deduction)
          </label>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {result ? (
        <>
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-slate-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-slate-100"
          >
            {result.better === "equal" ? (
              <>Both regimes give the same tax.</>
            ) : (
              <>
                The <strong>{result.better === "new" ? "new" : "old"} regime</strong> saves you{" "}
                <strong>{formatINR(result.savings)}</strong> a year.
              </>
            )}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Tax under the new and old regimes</caption>
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                  <th scope="col" className="py-2 pr-2 font-medium text-slate-500 dark:text-slate-400">
                    <span className="sr-only">Item</span>
                  </th>
                  <th scope="col" className="py-2 px-2 text-right font-semibold text-slate-900 dark:text-white">
                    New regime
                  </th>
                  <th scope="col" className="py-2 pl-2 text-right font-semibold text-slate-900 dark:text-white">
                    Old regime
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ROWS.map(({ key, label }) => (
                  <tr key={key}>
                    <th scope="row" className="py-2 pr-2 text-left font-normal text-slate-600 dark:text-slate-400">
                      {label}
                    </th>
                    <td className="py-2 px-2 text-right text-slate-900 dark:text-white">
                      {formatINR(result.newRegime[key] as number)}
                    </td>
                    <td className="py-2 pl-2 text-right text-slate-900 dark:text-white">
                      {formatINR(result.oldRegime[key] as number)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                  <th scope="row" className="py-2 pr-2 text-left font-semibold text-slate-900 dark:text-white">
                    Total tax
                  </th>
                  <td className="py-2 px-2 text-right text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatINR(result.newRegime.totalTax)}
                  </td>
                  <td className="py-2 pl-2 text-right text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatINR(result.oldRegime.totalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Estimate for FY 2026-27 (slabs unchanged from FY 2025-26) for resident individuals. Excludes
        special-rate income like capital gains, lottery or crypto. Confirm with a tax professional
        before filing.
      </p>
    </div>
  );
}
