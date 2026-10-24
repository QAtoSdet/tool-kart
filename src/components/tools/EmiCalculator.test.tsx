import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmiCalculator } from "./EmiCalculator";

describe("EmiCalculator", () => {
  it("shows an EMI for the default inputs", () => {
    render(<EmiCalculator />);
    // Default 10,00,000 @ 8.5% for 10y -> EMI ≈ ₹12,399
    expect(screen.getByText("Monthly EMI")).toBeInTheDocument();
    expect(screen.getByText(/₹12,399|₹12,398/)).toBeInTheDocument();
  });

  it("recomputes when inputs change", () => {
    render(<EmiCalculator />);
    fireEvent.change(screen.getByLabelText("Loan amount (₹)"), { target: { value: "120000" } });
    fireEvent.change(screen.getByLabelText("Interest rate (% p.a.)"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Tenure (years)"), { target: { value: "1" } });
    // 1,20,000 at 0% over 12 months = ₹10,000/month
    expect(screen.getByText("₹10,000")).toBeInTheDocument();
  });

  it("errors on an invalid loan amount", () => {
    render(<EmiCalculator />);
    fireEvent.change(screen.getByLabelText("Loan amount (₹)"), { target: { value: "0" } });
    expect(screen.getByRole("alert")).toHaveTextContent(/greater than 0/i);
  });
});
