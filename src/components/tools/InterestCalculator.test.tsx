import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InterestCalculator } from "./InterestCalculator";

describe("InterestCalculator", () => {
  it("compares simple and compound interest for the default ₹1L at 7% for 5 years", () => {
    render(<InterestCalculator />);
    // Each total appears in its result card and again in the table's final row.
    expect(screen.getAllByText("₹1,35,000")).toHaveLength(2); // SI total
    expect(screen.getAllByText("₹1,40,255")).toHaveLength(2); // yearly CI total
    expect(screen.getByRole("status")).toHaveTextContent(/₹5,255 more/);
    expect(screen.getAllByRole("row")).toHaveLength(6); // header + 5 years
  });

  it("recalculates when compounding changes to quarterly", () => {
    render(<InterestCalculator />);
    fireEvent.change(screen.getByLabelText("Compounding"), { target: { value: "quarterly" } });
    expect(screen.getAllByText("₹1,41,478").length).toBeGreaterThan(0);
  });

  it("adds a part-year row for extra months", () => {
    render(<InterestCalculator />);
    fireEvent.change(screen.getByLabelText("Years"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Months"), { target: { value: "6" } });
    expect(screen.getByRole("rowheader", { name: "1 yr 6 mo" })).toBeInTheDocument();
  });

  it("shows an error for 12 or more months", () => {
    render(<InterestCalculator />);
    fireEvent.change(screen.getByLabelText("Months"), { target: { value: "12" } });
    expect(screen.getByRole("alert")).toHaveTextContent(/0–11 months/);
  });
});
