import { describe, it, expect } from "vitest";
import { percentOf, whatPercent, percentChange } from "./percentage";

describe("percentOf", () => {
  it("computes X% of Y", () => {
    expect(percentOf(15, 200)).toBe(30);
    expect(percentOf(0, 200)).toBe(0);
  });
});

describe("whatPercent", () => {
  it("computes X is what % of Y", () => {
    expect(whatPercent(30, 200)).toBe(15);
  });
  it("returns null when dividing by zero", () => {
    expect(whatPercent(30, 0)).toBeNull();
  });
});

describe("percentChange", () => {
  it("computes increase and decrease", () => {
    expect(percentChange(200, 250)).toBe(25);
    expect(percentChange(200, 150)).toBe(-25);
  });
  it("returns null when old value is zero", () => {
    expect(percentChange(0, 100)).toBeNull();
  });
});
