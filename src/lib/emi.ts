/**
 * EMI (Equated Monthly Instalment) math — pure and unit-tested.
 *
 * Standard reducing-balance formula:
 *   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly interest rate (annual / 12 / 100),
 * n = number of monthly instalments. Handles the r = 0 edge case.
 */

export interface EmiInput {
  /** Loan principal amount. */
  principal: number;
  /** Annual interest rate as a percentage, e.g. 8.5 for 8.5%. */
  annualRatePercent: number;
  /** Tenure in months. */
  months: number;
}

export interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateEmi({ principal, annualRatePercent, months }: EmiInput): EmiResult {
  if (principal <= 0 || months <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 };
  }

  const r = annualRatePercent / 12 / 100;

  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    const pow = Math.pow(1 + r, months);
    emi = (principal * r * pow) / (pow - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

export interface AmortizationRow {
  month: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

/**
 * Yearly amortization summary: how much principal vs interest is paid each year,
 * and the remaining balance at year end. Useful without overwhelming the UI with
 * a per-month table.
 */
export function yearlyAmortization(input: EmiInput): AmortizationRow[] {
  const { principal, annualRatePercent, months } = input;
  if (principal <= 0 || months <= 0) return [];

  const r = annualRatePercent / 12 / 100;
  const { emi } = calculateEmi(input);

  const rows: AmortizationRow[] = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let principalComponent = emi - interest;
    // Final instalment: clamp to remaining balance to avoid tiny rounding drift.
    if (m === months || principalComponent > balance) {
      principalComponent = balance;
    }
    balance -= principalComponent;
    yearPrincipal += principalComponent;
    yearInterest += interest;

    if (m % 12 === 0 || m === months) {
      rows.push({
        month: m,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance: Math.max(0, balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }
  return rows;
}

/** Format a number as Indian Rupees with grouping (e.g. ₹1,23,456). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
