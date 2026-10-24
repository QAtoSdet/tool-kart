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

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/60">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(toISO(todayLocal()));

  const { age, error }: { age: AgeResult | null; error: string | null } = useMemo(() => {
    const birth = parseISODate(dob);
    const ref = parseISODate(asOf);
    if (!dob) return { age: null, error: null };
    if (!birth) return { age: null, error: "Please enter a valid date of birth." };
    if (!ref) return { age: null, error: "Please enter a valid reference date." };
    if (isAfter(birth, ref)) {
      return { age: null, error: "Date of birth can't be after the reference date." };
    }
    return { age: calculateAge(birth, ref), error: null };
  }, [dob, asOf]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth" htmlFor="dob">
          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>
        <Field label="Age as of" htmlFor="asof" hint="Defaults to today.">
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
            You are{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {age.years} years, {age.months} months and {age.days} days
            </span>{" "}
            old.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={age.totalDays.toLocaleString()} label="Total days" />
            <Stat value={(age.years * 12 + age.months).toLocaleString()} label="Total months" />
            <Stat value={age.daysToNextBirthday} label="Days to next birthday" />
            <Stat value={age.bornOnWeekday} label="Born on a" />
          </div>
        </Card>
      ) : null}

      <DateDifference />
    </div>
  );
}

/** Secondary tool: difference between two dates + add/subtract days. */
function DateDifference() {
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
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
        Days between two dates
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" htmlFor="start">
          <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="End date" htmlFor="end">
          <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>
      {diff !== null ? (
        <p className="mt-4 text-slate-700 dark:text-slate-200">
          There are{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {diff.toLocaleString()} day{diff === 1 ? "" : "s"}
          </span>{" "}
          between these dates.
        </p>
      ) : null}
    </Card>
  );
}
