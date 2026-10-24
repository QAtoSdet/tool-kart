/**
 * Password generation — pure logic, unit-tested. Uses crypto.getRandomValues
 * when available (browser) for cryptographically strong randomness, falling
 * back to Math.random only if crypto is unavailable. Runs entirely client-side.
 */

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

/** Build the character pool from the selected option flags. */
export function buildPool(options: PasswordOptions): string {
  let pool = "";
  if (options.uppercase) pool += SETS.uppercase;
  if (options.lowercase) pool += SETS.lowercase;
  if (options.numbers) pool += SETS.numbers;
  if (options.symbols) pool += SETS.symbols;
  return pool;
}

function randomInt(maxExclusive: number): number {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const arr = new Uint32Array(1);
    globalThis.crypto.getRandomValues(arr);
    return arr[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

/** Generate a password. Returns "" if no character set is selected. */
export function generatePassword(options: PasswordOptions): string {
  const pool = buildPool(options);
  const length = Math.max(1, Math.min(128, Math.floor(options.length)));
  if (pool.length === 0) return "";

  let out = "";
  for (let i = 0; i < length; i++) {
    out += pool[randomInt(pool.length)];
  }
  return out;
}

export type Strength = "Weak" | "Fair" | "Strong" | "Very strong";

/** Rough strength label based on length and variety of character sets. */
export function passwordStrength(options: PasswordOptions): Strength {
  const sets = [options.uppercase, options.lowercase, options.numbers, options.symbols].filter(
    Boolean,
  ).length;
  const len = options.length;

  if (len < 8 || sets <= 1) return "Weak";
  if (len < 12 || sets === 2) return "Fair";
  if (len < 16 || sets === 3) return "Strong";
  return "Very strong";
}
