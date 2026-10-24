/**
 * SIP (Systematic Investment Plan) and lumpsum investment math — pure, tested.
 *
 * SIP future value with monthly compounding:
 *   FV = P × [ ((1+i)^n − 1) / i ] × (1+i)
 * where P = monthly investment, i = monthly rate (annual/12/100), n = months.
 * The trailing (1+i) assumes investment at the start of each month.
 */

export interface SipInput {
  monthlyInvestment: number;
  annualRatePercent: number;
  years: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
}

export function calculateSip({
  monthlyInvestment,
  annualRatePercent,
  years,
}: SipInput): SipResult {
  const n = Math.round(years * 12);
  if (monthlyInvestment <= 0 || n <= 0) {
    return { investedAmount: 0, estimatedReturns: 0, futureValue: 0 };
  }

  const i = annualRatePercent / 12 / 100;
  const invested = monthlyInvestment * n;

  let futureValue: number;
  if (i === 0) {
    futureValue = invested;
  } else {
    futureValue = monthlyInvestment * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  return {
    investedAmount: invested,
    estimatedReturns: futureValue - invested,
    futureValue,
  };
}

/** Format a number as Indian Rupees with grouping (no decimals). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
