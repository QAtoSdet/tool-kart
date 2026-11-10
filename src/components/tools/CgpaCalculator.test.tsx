import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CgpaCalculator } from "./CgpaCalculator";

describe("CgpaCalculator", () => {
  it("converts with the CBSE formula by default and shows its source", () => {
    render(<CgpaCalculator />);
    expect(screen.getByRole("status")).toHaveTextContent("77.9%"); // 8.2 × 9.5
    expect(screen.getByText(/CBSE Circular No. 24/)).toBeInTheDocument();
  });

  it("recalculates when the university changes", () => {
    render(<CgpaCalculator />);
    fireEvent.change(screen.getByLabelText("Board or university"), {
      target: { value: "vtu-2015-2021" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("74.5%");
  });

  it("supports a custom formula", () => {
    render(<CgpaCalculator />);
    fireEvent.change(screen.getByLabelText("Board or university"), { target: { value: "custom" } });
    fireEvent.change(screen.getByLabelText("Subtract from CGPA"), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText("Multiply by"), { target: { value: "10" } });
    expect(screen.getByRole("status")).toHaveTextContent("77%"); // (8.2 − 0.5) × 10
  });

  it("shows an error for a CGPA above 10", () => {
    render(<CgpaCalculator />);
    fireEvent.change(screen.getByLabelText("Your CGPA (out of 10)"), { target: { value: "11" } });
    expect(screen.getByRole("alert")).toHaveTextContent(/between 0 and 10/);
  });
});
