import { describe, it, expect } from "vitest";
import { calculateEmi, yearlyAmortization, formatINR } from "./emi";

describe("calculateEmi", () => {
  it("matches a known EMI example", () => {
    // ₹10,00,000 at 8.5% for 120 months -> EMI ≈ ₹12,398.57
    const r = calculateEmi({ principal: 1000000, annualRatePercent: 8.5, months: 120 });
    expect(r.emi).toBeCloseTo(12398.57, 1);
    expect(r.totalPayment).toBeCloseTo(12398.57 * 120, 0);
    expect(r.totalInterest).toBeCloseTo(r.totalPayment - 1000000, 0);
  });

  it("handles zero interest (EMI = principal / months)", () => {
    const r = calculateEmi({ principal: 120000, annualRatePercent: 0, months: 12 });
    expect(r.emi).toBe(10000);
    expect(r.totalInterest).toBe(0);
  });

  it("returns zeros for invalid input", () => {
    expect(calculateEmi({ principal: 0, annualRatePercent: 10, months: 12 }).emi).toBe(0);
    expect(calculateEmi({ principal: 1000, annualRatePercent: 10, months: 0 }).emi).toBe(0);
  });
});

describe("yearlyAmortization", () => {
  it("fully amortizes the loan (balance ends at 0)", () => {
    const rows = yearlyAmortization({ principal: 1000000, annualRatePercent: 8.5, months: 120 });
    expect(rows.length).toBe(10); // 10 years
    expect(rows[rows.length - 1].balance).toBeCloseTo(0, 2);
  });

  it("total principal paid equals the original principal", () => {
    const rows = yearlyAmortization({ principal: 500000, annualRatePercent: 10, months: 60 });
    const totalPrincipal = rows.reduce((s, r) => s + r.principalPaid, 0);
    expect(totalPrincipal).toBeCloseTo(500000, 2);
  });
});

describe("formatINR", () => {
  it("formats with Indian grouping and the rupee symbol", () => {
    const out = formatINR(123456);
    expect(out).toContain("₹");
    expect(out).toContain("1,23,456");
  });
});
