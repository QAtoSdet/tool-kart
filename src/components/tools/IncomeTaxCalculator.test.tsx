import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IncomeTaxCalculator } from "./IncomeTaxCalculator";

const totals = () =>
  screen.getByRole("row", { name: /total tax/i }).querySelectorAll("td");

describe("IncomeTaxCalculator", () => {
  it("compares both regimes for the default ₹15L salary with ₹1.5L deductions", () => {
    render(<IncomeTaxCalculator />);
    const [newTotal, oldTotal] = totals();
    expect(newTotal).toHaveTextContent("₹97,500");
    expect(oldTotal).toHaveTextContent("₹2,10,600");
    expect(screen.getByRole("status")).toHaveTextContent(/new regime.*saves.*₹1,13,100/i);
  });

  it("recommends the old regime when deductions are large", () => {
    render(<IncomeTaxCalculator />);
    fireEvent.change(screen.getByLabelText("Annual income (₹)"), { target: { value: "2000000" } });
    fireEvent.change(screen.getByLabelText("Old-regime deductions (₹)"), { target: { value: "800000" } });
    expect(screen.getByRole("status")).toHaveTextContent(/old regime.*saves.*₹28,600/i);
  });

  it("shows an error for a negative income", () => {
    render(<IncomeTaxCalculator />);
    fireEvent.change(screen.getByLabelText("Annual income (₹)"), { target: { value: "-1" } });
    expect(screen.getByRole("alert")).toHaveTextContent(/valid annual income/i);
  });
});
