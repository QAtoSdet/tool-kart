"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import { calculateGst, GST_RATES, type GstMode } from "@/lib/gst";
import { formatINR } from "@/lib/sip";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={
          strong
            ? "text-lg font-bold text-blue-600 dark:text-blue-400"
            : "font-medium text-slate-900 dark:text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<GstMode>("add");

  const result = useMemo(
    () => calculateGst({ amount: Number(amount) || 0, ratePercent: Number(rate) || 0, mode }),
    [amount, rate, mode],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Amount (₹)" htmlFor="amount">
          <Input
            id="amount"
            type="number"
            min={0}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="GST rate" htmlFor="rate">
          <Select id="rate" value={rate} onChange={(e) => setRate(e.target.value)}>
            {GST_RATES.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Mode" htmlFor="mode">
          <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value as GstMode)}>
            <option value="add">Add GST (exclusive)</option>
            <option value="remove">Remove GST (inclusive)</option>
          </Select>
        </Field>
      </div>

      <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 px-4 dark:divide-slate-700 dark:bg-slate-800/60">
        <Row label="Base amount" value={formatINR(result.base)} />
        <Row label={`CGST (${Number(rate) / 2}%)`} value={formatINR(result.cgst)} />
        <Row label={`SGST (${Number(rate) / 2}%)`} value={formatINR(result.sgst)} />
        <Row label="Total GST" value={formatINR(result.gst)} />
        <Row label="Total amount" value={formatINR(result.total)} strong />
      </div>
    </div>
  );
}
