"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import {
  calculateAge,
  daysBetween,
  isAfter,
  parseISODate,
  toISO,
  todayLocal,
  type AgeResult,
} from "@/lib/date-math";

/**
 * Every visible string, so the Hindi page can reuse the widget. Plain data only (no functions),
 * because a server page passes it to this client component.
 */
export interface AgeLabels {
  dob: string;
  asOf: string;
  asOfHint: string;
  errorDob: string;
  errorRef: string;
  errorOrder: string;
  /** "You are [34 years, 2 months and 5 days] old." */
  agePrefix: string;
  ageSuffix: string;
  years: string;
  months: string;
  days: string;
  and: string;
  totalDays: string;
  totalMonths: string;
  daysToBirthday: string;
  bornOn: string;
  /** English weekday name → displayed name. Missing entries show the English name. */
  weekdays?: Record<string, string>;
  diffHeading: string;
  start: string;
  end: string;
  /** "There are [10 days] between these dates." */
  diffPrefix: string;
  diffSuffix: string;
  day: string;
  dayPlural: string;
}

export const ENGLISH_AGE_LABELS: AgeLabels = {
  dob: "Date of birth",
  asOf: "Age as of",
  asOfHint: "Defaults to today.",
  errorDob: "Please enter a valid date of birth.",
  errorRef: "Please enter a valid reference date.",
  errorOrder: "Date of birth can't be after the reference date.",
  agePrefix: "You are",
  ageSuffix: "old.",
  years: "years",
  months: "months",
  days: "days",
  and: "and",
  totalDays: "Total days",
  totalMonths: "Total months",
  daysToBirthday: "Days to next birthday",
  bornOn: "Born on a",
  diffHeading: "Days between two dates",
  start: "Start date",
  end: "End date",
  diffPrefix: "There are",
  diffSuffix: "between these dates.",
  day: "day",
  dayPlural: "days",
};

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/60">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function AgeCalculator({ labels = ENGLISH_AGE_LABELS }: { labels?: AgeLabels }) {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(toISO(todayLocal()));

  const { age, error }: { age: AgeResult | null; error: string | null } = useMemo(() => {
    const birth = parseISODate(dob);
    const ref = parseISODate(asOf);
    if (!dob) return { age: null, error: null };
    if (!birth) return { age: null, error: labels.errorDob };
    if (!ref) return { age: null, error: labels.errorRef };
    if (isAfter(birth, ref)) return { age: null, error: labels.errorOrder };
    return { age: calculateAge(birth, ref), error: null };
  }, [dob, asOf, labels]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={labels.dob} htmlFor="dob">
          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>
        <Field label={labels.asOf} htmlFor="asof" hint={labels.asOfHint}>
          <Input id="asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </Field>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {age ? (
        <Card>
          <p className="mb-4 text-center text-lg text-slate-700 dark:text-slate-200">
            {labels.agePrefix}{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {age.years} {labels.years}, {age.months} {labels.months} {labels.and} {age.days} {labels.days}
            </span>{" "}
            {labels.ageSuffix}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={age.totalDays.toLocaleString("en-IN")} label={labels.totalDays} />
            <Stat value={(age.years * 12 + age.months).toLocaleString("en-IN")} label={labels.totalMonths} />
            <Stat value={age.daysToNextBirthday} label={labels.daysToBirthday} />
            <Stat value={labels.weekdays?.[age.bornOnWeekday] ?? age.bornOnWeekday} label={labels.bornOn} />
          </div>
        </Card>
      ) : null}

      <DateDifference labels={labels} />
    </div>
  );
}

/** Secondary tool: difference between two dates. */
function DateDifference({ labels }: { labels: AgeLabels }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const diff = useMemo(() => {
    const a = parseISODate(start);
    const b = parseISODate(end);
    if (!a || !b) return null;
    return daysBetween(a, b);
  }, [start, end]);

  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{labels.diffHeading}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={labels.start} htmlFor="start">
          <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label={labels.end} htmlFor="end">
          <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>
      {diff !== null ? (
        <p className="mt-4 text-slate-700 dark:text-slate-200">
          {labels.diffPrefix}{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {diff.toLocaleString("en-IN")} {diff === 1 ? labels.day : labels.dayPlural}
          </span>{" "}
          {labels.diffSuffix}
        </p>
      ) : null}
    </Card>
  );
}
