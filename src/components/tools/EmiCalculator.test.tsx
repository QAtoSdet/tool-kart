import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmiCalculator, emiChartSummary } from "./EmiCalculator";

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

describe("EmiCalculator charts", () => {
  it("shows the principal/interest split with amounts and percentages in text", () => {
    render(<EmiCalculator />);
    // Default 10,00,000 @ 8.5% for 10y: total interest ≈ ₹4,87,8xx, about 33% of the total.
    expect(screen.getByText("Where your money goes")).toBeInTheDocument();
    expect(screen.getByText("(67%)")).toBeInTheDocument();
    expect(screen.getByText("(33%)")).toBeInTheDocument();
  });

  it("describes the yearly chart for screen readers", () => {
    render(<EmiCalculator />);
    const chart = screen.getByRole("img", { name: /yearly payments/ });
    const name = chart.getAttribute("aria-label")!;
    const [first, last] = [...name.matchAll(/(\d+)%/g)].map((m) => Number(m[1]));
    expect(name).toMatch(/over 10 years/);
    expect(first).toBeGreaterThan(last); // interest share falls as the loan is repaid
  });
});

describe("emiChartSummary", () => {
  it("uses the first and final year's interest share", () => {
    const rows = [
      { month: 12, principalPaid: 40, interestPaid: 60, balance: 60 },
      { month: 24, principalPaid: 90, interestPaid: 10, balance: 0 },
    ];
    expect(emiChartSummary(rows)).toBe(
      "Chart of yearly payments split into principal and interest over 2 years. In year 1, 60% of what you pay goes to interest; by the final year it is 10%.",
    );
  });

  it("handles a loan shorter than a year", () => {
    expect(emiChartSummary([{ month: 6, principalPaid: 75, interestPaid: 25, balance: 0 }])).toBe(
      "Chart of yearly payments: 25% of what you pay goes to interest.",
    );
  });
});
