import { describe, it, expect } from "vitest";
import {
  daysInMonth,
  isLeapYear,
  parseISODate,
  daysBetween,
  diffYMD,
  calculateAge,
  addDays,
  toISO,
} from "./date-math";

describe("isLeapYear", () => {
  it("applies the Gregorian rules", () => {
    expect(isLeapYear(2000)).toBe(true); // divisible by 400
    expect(isLeapYear(1900)).toBe(false); // divisible by 100 not 400
    expect(isLeapYear(2024)).toBe(true); // divisible by 4
    expect(isLeapYear(2023)).toBe(false);
  });
});

describe("daysInMonth", () => {
  it("handles February in leap and non-leap years", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
  });
  it("handles 30/31-day months", () => {
    expect(daysInMonth(2023, 4)).toBe(30);
    expect(daysInMonth(2023, 12)).toBe(31);
  });
});

describe("parseISODate", () => {
  it("parses valid dates", () => {
    expect(parseISODate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
  });
  it("rejects invalid dates", () => {
    expect(parseISODate("2023-02-29")).toBeNull(); // not a leap year
    expect(parseISODate("2023-13-01")).toBeNull();
    expect(parseISODate("not-a-date")).toBeNull();
    expect(parseISODate("2023-04-31")).toBeNull(); // April has 30 days
  });
});

describe("diffYMD", () => {
  it("computes a simple full-year difference", () => {
    expect(diffYMD({ year: 2000, month: 1, day: 1 }, { year: 2020, month: 1, day: 1 })).toEqual({
      years: 20,
      months: 0,
      days: 0,
    });
  });

  it("borrows days across a month boundary", () => {
    // From Jan 31 to Mar 1 (2023): 1 month 1 day? Count: Jan31->Feb28 = ~1 month minus, then +1 day
    const r = diffYMD({ year: 2023, month: 1, day: 31 }, { year: 2023, month: 3, day: 1 });
    expect(r).toEqual({ years: 0, months: 1, days: 1 });
  });

  it("borrows months across a year boundary", () => {
    const r = diffYMD({ year: 2000, month: 12, day: 15 }, { year: 2001, month: 1, day: 10 });
    // Dec 15 -> Jan 10: 0 years, 0 months, borrow: days = 10-15 = -5 -> +31 (Dec) = 26, months -1 -> +12... 
    expect(r.years).toBe(0);
    expect(r.months).toBe(0);
    expect(r.days).toBe(26);
  });

  it("handles a leap-day birth to a non-leap year", () => {
    // Convention: a Feb 29 birthday completes on the last day of February
    // (Feb 28) in non-leap years, so this is exactly 23 years.
    const r = diffYMD({ year: 2000, month: 2, day: 29 }, { year: 2023, month: 2, day: 28 });
    expect(r).toEqual({ years: 23, months: 0, days: 0 });
    // One day earlier it is not yet complete: 22 years and some months/days.
    const before = diffYMD({ year: 2000, month: 2, day: 29 }, { year: 2023, month: 2, day: 27 });
    expect(before.years).toBe(22);
  });
});

describe("daysBetween", () => {
  it("counts whole days including across a leap day", () => {
    expect(
      daysBetween({ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 }),
    ).toBe(2); // Feb 28 -> Feb 29 -> Mar 1
    expect(
      daysBetween({ year: 2023, month: 2, day: 28 }, { year: 2023, month: 3, day: 1 }),
    ).toBe(1);
  });
});

describe("calculateAge", () => {
  it("computes age and days to next birthday", () => {
    const age = calculateAge(
      { year: 1990, month: 6, day: 15 },
      { year: 2024, month: 6, day: 15 },
    );
    expect(age.years).toBe(34);
    expect(age.months).toBe(0);
    expect(age.days).toBe(0);
    expect(age.daysToNextBirthday).toBe(0); // today is the birthday
  });

  it("computes days to the next birthday later in the year", () => {
    const age = calculateAge(
      { year: 1990, month: 12, day: 31 },
      { year: 2024, month: 12, day: 25 },
    );
    expect(age.daysToNextBirthday).toBe(6);
  });

  it("reports the correct birth weekday", () => {
    // 2000-01-01 was a Saturday.
    const age = calculateAge(
      { year: 2000, month: 1, day: 1 },
      { year: 2024, month: 1, day: 1 },
    );
    expect(age.bornOnWeekday).toBe("Saturday");
  });
});

describe("addDays", () => {
  it("adds across month/year boundaries", () => {
    expect(toISO(addDays({ year: 2023, month: 12, day: 31 }, 1))).toBe("2024-01-01");
    expect(toISO(addDays({ year: 2024, month: 2, day: 28 }, 1))).toBe("2024-02-29");
  });
  it("subtracts with negative values", () => {
    expect(toISO(addDays({ year: 2024, month: 1, day: 1 }, -1))).toBe("2023-12-31");
  });
});
