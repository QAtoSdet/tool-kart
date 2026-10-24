import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AgeCalculator } from "./AgeCalculator";

describe("AgeCalculator", () => {
  it("computes age from a date of birth and reference date", () => {
    render(<AgeCalculator />);
    fireEvent.change(screen.getByLabelText("Date of birth"), {
      target: { value: "1990-06-15" },
    });
    fireEvent.change(screen.getByLabelText("Age as of"), {
      target: { value: "2024-06-15" },
    });
    expect(screen.getByText(/34 years, 0 months and 0 days/)).toBeInTheDocument();
  });

  it("errors when DOB is after the reference date", () => {
    render(<AgeCalculator />);
    fireEvent.change(screen.getByLabelText("Date of birth"), {
      target: { value: "2030-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Age as of"), {
      target: { value: "2024-01-01" },
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/can't be after/i);
  });

  it("computes days between two dates", () => {
    render(<AgeCalculator />);
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2024-01-11" },
    });
    expect(screen.getByText(/10 days/)).toBeInTheDocument();
  });
});
