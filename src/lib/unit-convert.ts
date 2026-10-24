/**
 * Config-driven unit conversion — pure and unit-tested.
 *
 * Linear categories (length, weight, area) define each unit's factor relative
 * to a base unit; conversion is value * fromFactor / toFactor. Temperature is
 * non-linear and handled with explicit to/from base (Celsius) functions.
 *
 * To add a category, add an entry to CATEGORIES. No other code changes needed.
 */

export interface LinearUnit {
  id: string;
  label: string;
  /** How many base units one of this unit equals. */
  factor: number;
}

export interface LinearCategory {
  id: string;
  label: string;
  kind: "linear";
  baseUnit: string;
  units: LinearUnit[];
}

export interface TemperatureUnit {
  id: string;
  label: string;
  toBase: (v: number) => number; // to Celsius
  fromBase: (v: number) => number; // from Celsius
}

export interface TemperatureCategory {
  id: string;
  label: string;
  kind: "temperature";
  units: TemperatureUnit[];
}

export type Category = LinearCategory | TemperatureCategory;

export const CATEGORIES: Category[] = [
  {
    id: "length",
    label: "Length",
    kind: "linear",
    baseUnit: "m",
    units: [
      { id: "mm", label: "Millimetre (mm)", factor: 0.001 },
      { id: "cm", label: "Centimetre (cm)", factor: 0.01 },
      { id: "m", label: "Metre (m)", factor: 1 },
      { id: "km", label: "Kilometre (km)", factor: 1000 },
      { id: "in", label: "Inch (in)", factor: 0.0254 },
      { id: "ft", label: "Foot (ft)", factor: 0.3048 },
      { id: "yd", label: "Yard (yd)", factor: 0.9144 },
      { id: "mi", label: "Mile (mi)", factor: 1609.344 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    kind: "linear",
    baseUnit: "kg",
    units: [
      { id: "mg", label: "Milligram (mg)", factor: 0.000001 },
      { id: "g", label: "Gram (g)", factor: 0.001 },
      { id: "kg", label: "Kilogram (kg)", factor: 1 },
      { id: "t", label: "Tonne (t)", factor: 1000 },
      { id: "lb", label: "Pound (lb)", factor: 0.45359237 },
      { id: "oz", label: "Ounce (oz)", factor: 0.028349523125 },
    ],
  },
  {
    id: "area",
    label: "Area",
    kind: "linear",
    baseUnit: "sqm",
    units: [
      { id: "sqm", label: "Square metre (m²)", factor: 1 },
      { id: "sqft", label: "Square foot (sq ft)", factor: 0.09290304 },
      { id: "sqyd", label: "Square yard (sq yd)", factor: 0.83612736 },
      { id: "sqkm", label: "Square kilometre (km²)", factor: 1000000 },
      { id: "acre", label: "Acre", factor: 4046.8564224 },
      { id: "hectare", label: "Hectare", factor: 10000 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    kind: "temperature",
    units: [
      {
        id: "c",
        label: "Celsius (°C)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: "f",
        label: "Fahrenheit (°F)",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      {
        id: "k",
        label: "Kelvin (K)",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * Convert a value within a category from one unit to another.
 * Returns null if the category or units are unknown.
 */
export function convert(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number,
): number | null {
  const category = getCategory(categoryId);
  if (!category) return null;

  if (category.kind === "linear") {
    const from = category.units.find((u) => u.id === fromUnitId);
    const to = category.units.find((u) => u.id === toUnitId);
    if (!from || !to) return null;
    return (value * from.factor) / to.factor;
  }

  // temperature
  const from = category.units.find((u) => u.id === fromUnitId);
  const to = category.units.find((u) => u.id === toUnitId);
  if (!from || !to) return null;
  return to.fromBase(from.toBase(value));
}

/** Trim trailing zeros for display without losing precision. */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "";
  // Up to 6 significant decimals, then strip trailing zeros.
  const rounded = Number(value.toPrecision(10));
  return String(rounded);
}
