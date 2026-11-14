"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import { CopyButton } from "@/components/ui/CopyButton";
import { calculateGst, GST_RATES, OLD_GST_RATES, type GstMode } from "@/lib/gst";
import { formatINR } from "@/lib/sip";

/** Every visible string, so the Hindi page can reuse the widget. */
export interface GstLabels {
  amount: string;
  rate: string;
  currentRates: string;
  oldRates: string;
  mode: string;
  add: string;
  remove: string;
  base: string;
  totalGst: string;
  total: string;
  copyTotal: string;
  copied: string;
}

export const ENGLISH_GST_LABELS: GstLabels = {
  amount: "Amount (₹)",
  rate: "GST rate",
  currentRates: "Current rates (from 22 Sep 2025)",
  oldRates: "Old rates (bills before 22 Sep 2025)",
  mode: "Mode",
  add: "Add GST (exclusive)",
  remove: "Remove GST (inclusive)",
  base: "Base amount",
  totalGst: "Total GST",
  total: "Total amount",
  copyTotal: "Copy total",
  copied: "Copied!",
};

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

export function GstCalculator({ labels = ENGLISH_GST_LABELS }: { labels?: GstLabels }) {
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
        <Field label={labels.amount} htmlFor="amount">
          <Input
            id="amount"
            type="number"
            min={0}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label={labels.rate} htmlFor="rate">
          <Select id="rate" value={rate} onChange={(e) => setRate(e.target.value)}>
            <optgroup label={labels.currentRates}>
              {GST_RATES.map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </optgroup>
            <optgroup label={labels.oldRates}>
              {OLD_GST_RATES.map((r) => (
                <option key={r} value={r}>
                  {r}%
                </option>
              ))}
            </optgroup>
          </Select>
        </Field>
        <Field label={labels.mode} htmlFor="mode">
          <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value as GstMode)}>
            <option value="add">{labels.add}</option>
            <option value="remove">{labels.remove}</option>
          </Select>
        </Field>
      </div>

      <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 px-4 dark:divide-slate-700 dark:bg-slate-800/60">
        <Row label={labels.base} value={formatINR(result.base)} />
        <Row label={`CGST (${Number(rate) / 2}%)`} value={formatINR(result.cgst)} />
        <Row label={`SGST (${Number(rate) / 2}%)`} value={formatINR(result.sgst)} />
        <Row label={labels.totalGst} value={formatINR(result.gst)} />
        <Row label={labels.total} value={formatINR(result.total)} strong />
      </div>

      <div className="flex justify-end">
        <CopyButton value={formatINR(result.total)} label={labels.copyTotal} copiedLabel={labels.copied} />
      </div>
    </div>
  );
}
