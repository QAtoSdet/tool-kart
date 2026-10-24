import { describe, it, expect } from "vitest";
import { convert, formatResult } from "./unit-convert";

describe("convert — length", () => {
  it("converts metres to feet", () => {
    expect(convert("length", "m", "ft", 1)!).toBeCloseTo(3.28084, 4);
  });
  it("converts km to miles", () => {
    expect(convert("length", "km", "mi", 1)!).toBeCloseTo(0.621371, 5);
  });
  it("is identity for same unit", () => {
    expect(convert("length", "m", "m", 42)).toBe(42);
  });
});

describe("convert — weight", () => {
  it("converts kg to pounds", () => {
    expect(convert("weight", "kg", "lb", 1)!).toBeCloseTo(2.204623, 5);
  });
});

describe("convert — area", () => {
  it("converts square feet to square metres", () => {
    expect(convert("area", "sqft", "sqm", 1)!).toBeCloseTo(0.092903, 5);
  });
  it("converts square metres to square feet", () => {
    expect(convert("area", "sqm", "sqft", 100)!).toBeCloseTo(1076.391, 2);
  });
});

describe("convert — temperature (non-linear)", () => {
  it("converts Celsius to Fahrenheit", () => {
    expect(convert("temperature", "c", "f", 100)).toBe(212);
    expect(convert("temperature", "c", "f", 0)).toBe(32);
    expect(convert("temperature", "c", "f", 37)!).toBeCloseTo(98.6, 1);
  });
  it("converts Fahrenheit to Celsius", () => {
    expect(convert("temperature", "f", "c", 32)).toBe(0);
    expect(convert("temperature", "f", "c", 212)).toBe(100);
  });
  it("converts Celsius to Kelvin", () => {
    expect(convert("temperature", "c", "k", 0)).toBeCloseTo(273.15, 2);
  });
});

describe("convert — invalid", () => {
  it("returns null for unknown category or unit", () => {
    expect(convert("nope", "m", "ft", 1)).toBeNull();
    expect(convert("length", "m", "unknown", 1)).toBeNull();
  });
});

describe("formatResult", () => {
  it("strips trailing zeros", () => {
    expect(formatResult(1.5)).toBe("1.5");
    expect(formatResult(2)).toBe("2");
    expect(formatResult(3.280839895)).toBe("3.280839895");
  });
});
