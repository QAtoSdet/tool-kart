import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnitConverter } from "./UnitConverter";

describe("UnitConverter", () => {
  it("converts the default length input", () => {
    render(<UnitConverter />);
    // Defaults: length, from = first unit (mm), to = second unit (cm), value 1.
    // 1 mm = 0.1 cm.
    const result = screen.getByLabelText("Converted result") as HTMLInputElement;
    expect(result.value).toBe("0.1");
  });

  it("switches category and converts temperature", () => {
    render(<UnitConverter />);
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "temperature" } });
    // After switching, from=Celsius, to=Fahrenheit (2nd unit). Enter 100 -> 212.
    fireEvent.change(screen.getByLabelText("Value to convert"), { target: { value: "100" } });
    const result = screen.getByLabelText("Converted result") as HTMLInputElement;
    expect(result.value).toBe("212");
  });

  it("swaps units", () => {
    render(<UnitConverter />);
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "area" } });
    // from=sqm, to=sqft; value 1 -> ~10.7639
    fireEvent.change(screen.getByLabelText("Value to convert"), { target: { value: "1" } });
    fireEvent.click(screen.getByLabelText("Swap units"));
    // now from=sqft, to=sqm; value still 1 -> ~0.092903
    const result = screen.getByLabelText("Converted result") as HTMLInputElement;
    expect(Number(result.value)).toBeCloseTo(0.092903, 5);
  });
});
