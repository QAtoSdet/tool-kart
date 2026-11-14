import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SipCalculator, sipChartSummary } from "./SipCalculator";

describe("SipCalculator", () => {
  it("shows the headline result and a growth chart for the defaults", () => {
    render(<SipCalculator />);
    expect(screen.getByText("₹11,61,695")).toBeInTheDocument(); // headline total value
    const chart = screen.getByRole("img", { name: /SIP growth/ });
    // Defaults: ₹5,000/month, 12%, 10 years.
    expect(chart).toHaveAccessibleName(/after 10 yr, ₹6,00,000 invested grows to an estimated ₹11,61,695/);
    expect(chart).toHaveAccessibleName(/most of the growth comes in the later years/);
  });

  it("removes the chart when the input is invalid", () => {
    render(<SipCalculator />);
    fireEvent.change(screen.getByLabelText("Monthly investment (₹)"), { target: { value: "0" } });
    expect(screen.queryByRole("img", { name: /SIP growth/ })).not.toBeInTheDocument();
  });
});

describe("sipChartSummary", () => {
  const point = (years: number, invested: number, value: number) => ({ years, invested, value });

  it("doesn't claim back-loaded growth at a 0% return", () => {
    const s = sipChartSummary([point(1, 100, 100), point(2, 200, 200), point(3, 300, 300), point(4, 400, 400)]);
    expect(s).not.toMatch(/most of the growth/);
    expect(s).toMatch(/Halfway, after 2 yr/);
  });

  it("describes a part-year tenure", () => {
    expect(sipChartSummary([point(0.5, 6000, 6100)])).toMatch(/after 6 mo, ₹6,000 invested/);
  });
});
