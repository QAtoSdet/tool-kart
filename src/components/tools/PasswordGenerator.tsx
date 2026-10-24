"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  generatePassword,
  passwordStrength,
  type PasswordOptions,
} from "@/lib/password";

const strengthColor: Record<string, string> = {
  Weak: "text-red-600 dark:text-red-400",
  Fair: "text-amber-600 dark:text-amber-400",
  Strong: "text-blue-600 dark:text-blue-400",
  "Very strong": "text-green-600 dark:text-green-400",
};

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generatePassword(options));
    setCopied(false);
  }, [options]);

  // Generate on mount and whenever options change.
  useEffect(() => {
    setPassword(generatePassword(options));
    setCopied(false);
  }, [options]);

  const toggle = (key: keyof PasswordOptions) =>
    setOptions((o) => ({ ...o, [key]: !o[key] }));

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked; ignore silently.
    }
  };

  const noneSelected =
    !options.uppercase && !options.lowercase && !options.numbers && !options.symbols;
  const strength = passwordStrength(options);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800">
        <output className="flex-1 break-all font-mono text-lg text-slate-900 dark:text-white">
          {password || (noneSelected ? "Select at least one character type" : "")}
        </output>
        <Button type="button" variant="secondary" size="sm" onClick={copy} disabled={!password}>
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button type="button" size="sm" onClick={regenerate} aria-label="Generate new password">
          ↻
        </Button>
      </div>

      <div>
        <label htmlFor="len" className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
          <span>Length</span>
          <span>{options.length}</span>
        </label>
        <input
          id="len"
          type="range"
          min={6}
          max={64}
          value={options.length}
          onChange={(e) => setOptions((o) => ({ ...o, length: Number(e.target.value) }))}
          className="mt-2 w-full accent-blue-600"
        />
      </div>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">Character types</legend>
        {(
          [
            ["uppercase", "Uppercase (A-Z)"],
            ["lowercase", "Lowercase (a-z)"],
            ["numbers", "Numbers (0-9)"],
            ["symbols", "Symbols (!@#…)"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"
          >
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggle(key)}
              className="h-4 w-4 accent-blue-600"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Strength: <span className={`font-semibold ${strengthColor[strength]}`}>{strength}</span>
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Passwords are generated on your device using your browser&apos;s secure random generator and
        are never sent anywhere.
      </p>
    </div>
  );
}
