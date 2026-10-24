"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/Input";
import { CATEGORIES, convert, formatResult, getCategory } from "@/lib/unit-convert";

export function UnitConverter() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const category = getCategory(categoryId)!;

  const [fromUnit, setFromUnit] = useState(category.units[0].id);
  const [toUnit, setToUnit] = useState(category.units[1]?.id ?? category.units[0].id);
  const [value, setValue] = useState("1");

  // Reset units when the category changes.
  const onCategoryChange = (id: string) => {
    const cat = getCategory(id)!;
    setCategoryId(id);
    setFromUnit(cat.units[0].id);
    setToUnit(cat.units[1]?.id ?? cat.units[0].id);
  };

  const result = useMemo(() => {
    const n = Number(value);
    if (value.trim() === "" || Number.isNaN(n)) return "";
    const out = convert(categoryId, fromUnit, toUnit, n);
    return out === null ? "" : formatResult(out);
  }, [categoryId, fromUnit, toUnit, value]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-6">
      <Field label="Category" htmlFor="category">
        <Select id="category" value={categoryId} onChange={(e) => onCategoryChange(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <Field label="From" htmlFor="from-unit">
            <Select id="from-unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </Select>
          </Field>
          <Input
            type="number"
            inputMode="decimal"
            aria-label="Value to convert"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap units"
          className="mb-2 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ⇄
        </button>

        <div className="space-y-3">
          <Field label="To" htmlFor="to-unit">
            <Select id="to-unit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </Select>
          </Field>
          <Input readOnly aria-label="Converted result" value={result} className="bg-slate-50 dark:bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
