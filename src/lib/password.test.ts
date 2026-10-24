import { describe, it, expect } from "vitest";
import {
  buildPool,
  generatePassword,
  passwordStrength,
  type PasswordOptions,
} from "./password";

const base: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

describe("buildPool", () => {
  it("includes selected sets only", () => {
    const pool = buildPool({ ...base, symbols: false, numbers: false });
    expect(/[A-Z]/.test(pool)).toBe(true);
    expect(/[a-z]/.test(pool)).toBe(true);
    expect(/[0-9]/.test(pool)).toBe(false);
  });
  it("is empty when nothing selected", () => {
    expect(
      buildPool({ length: 10, uppercase: false, lowercase: false, numbers: false, symbols: false }),
    ).toBe("");
  });
});

describe("generatePassword", () => {
  it("produces a password of the requested length", () => {
    expect(generatePassword({ ...base, length: 20 })).toHaveLength(20);
  });
  it("returns empty when no character set selected", () => {
    expect(
      generatePassword({ length: 12, uppercase: false, lowercase: false, numbers: false, symbols: false }),
    ).toBe("");
  });
  it("only uses characters from the selected pool", () => {
    const pw = generatePassword({ ...base, symbols: false, numbers: false });
    expect(/^[A-Za-z]+$/.test(pw)).toBe(true);
  });
});

describe("passwordStrength", () => {
  it("rates short/simple as weak", () => {
    expect(passwordStrength({ ...base, length: 6, symbols: false, numbers: false, uppercase: false })).toBe("Weak");
  });
  it("rates long + all sets as very strong", () => {
    expect(passwordStrength({ ...base, length: 20 })).toBe("Very strong");
  });
});
