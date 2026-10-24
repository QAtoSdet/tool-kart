/**
 * Pure, timezone-safe date math for the Age / Date Calculator.
 *
 * All functions operate on calendar dates (year/month/day), never on local
 * wall-clock times, so results don't drift across timezones or DST. Internally
 * we use UTC Date objects purely as a calendar, which is safe because we only
 * ever read/compare the date parts we set ourselves.
 */

export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  /** Days until the next birthday (0 if today is the birthday). */
  daysToNextBirthday: number;
  /** Which calendar day of the week the person was born (e.g. "Monday"). */
  bornOnWeekday: string;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Number of days in a given month (1-12) of a given year, leap-aware. */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Convert a CalendarDate to a UTC Date (midnight UTC). */
export function toUtc(d: CalendarDate): Date {
  return new Date(Date.UTC(d.year, d.month - 1, d.day));
}

/** Parse an ISO "YYYY-MM-DD" string into a CalendarDate, or null if invalid. */
export function parseISODate(value: string): CalendarDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** True if `a` is strictly after `b`. */
export function isAfter(a: CalendarDate, b: CalendarDate): boolean {
  return toUtc(a).getTime() > toUtc(b).getTime();
}

/** Whole days between two calendar dates (absolute value). */
export function daysBetween(a: CalendarDate, b: CalendarDate): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs(toUtc(a).getTime() - toUtc(b).getTime()) / MS_PER_DAY);
}

/**
 * Exact years/months/days from `birth` up to `asOf`, using the "count-up"
 * method that reliable date libraries use: advance whole years, then whole
 * months, then count the remaining days. This avoids the ambiguity of the
 * naive "borrow" approach around short months (e.g. Jan 31 -> Mar 1).
 *
 * Assumes birth <= asOf; callers should validate.
 */
export function diffYMD(
  birth: CalendarDate,
  asOf: CalendarDate,
): { years: number; months: number; days: number } {
  // Total whole months between the two year/month positions, then adjust if the
  // day-of-month hasn't been reached yet in the final month.
  let totalMonths = (asOf.year - birth.year) * 12 + (asOf.month - birth.month);

  // If we haven't reached birth's day-of-month in asOf's month, we've counted
  // one month too many. Clamp birth day to the length of asOf's month so a
  // birth on the 31st still "completes" in a shorter month on its last day.
  const effectiveBirthDay = Math.min(birth.day, daysInMonth(asOf.year, asOf.month));
  if (asOf.day < effectiveBirthDay) {
    totalMonths -= 1;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  // Days: from the anchor date (birth advanced by the whole years+months) to asOf.
  const anchor = addMonths(birth, years * 12 + months);
  const days = daysBetween(anchor, asOf);

  return { years, months, days };
}

/** Add whole months to a calendar date, clamping the day to the target month. */
export function addMonths(date: CalendarDate, n: number): CalendarDate {
  const zeroBased = date.month - 1 + n;
  const year = date.year + Math.floor(zeroBased / 12);
  const month = ((zeroBased % 12) + 12) % 12 + 1;
  const day = Math.min(date.day, daysInMonth(year, month));
  return { year, month, day };
}

/**
 * The next occurrence of birth's month/day on or after `asOf`.
 *
 * Convention for Feb 29 birthdays in non-leap years: the anniversary falls on
 * the last day of February (Feb 28). This matches the "completes on the last
 * day of a shorter month" rule used in diffYMD, so age and the birthday
 * countdown stay consistent.
 */
function nextBirthday(birth: CalendarDate, asOf: CalendarDate): CalendarDate {
  const clampDay = (year: number): { month: number; day: number } => {
    const month = birth.month;
    const day = Math.min(birth.day, daysInMonth(year, month));
    return { month, day };
  };

  let year = asOf.year;
  let { month, day } = clampDay(year);
  if (isAfter(asOf, { year, month, day })) {
    year += 1;
    ({ month, day } = clampDay(year));
  }
  return { year, month, day };
}

/** Full age breakdown as of a reference date (defaults to today, UTC calendar). */
export function calculateAge(birth: CalendarDate, asOf: CalendarDate): AgeResult {
  const { years, months, days } = diffYMD(birth, asOf);
  const totalDays = daysBetween(birth, asOf);
  const nb = nextBirthday(birth, asOf);
  const daysToNextBirthday = daysBetween(asOf, nb);
  const bornOnWeekday = WEEKDAYS[toUtc(birth).getUTCDay()];
  return { years, months, days, totalDays, daysToNextBirthday, bornOnWeekday };
}

/** Add (or subtract, with negative n) a number of days to a calendar date. */
export function addDays(date: CalendarDate, n: number): CalendarDate {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + n);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Today's date in the user's local calendar as a CalendarDate. */
export function todayLocal(): CalendarDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/** Format a CalendarDate as ISO "YYYY-MM-DD". */
export function toISO(d: CalendarDate): string {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}
