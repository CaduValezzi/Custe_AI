/**
 * API returns Decimals as JSON strings; never use JS Number for money math.
 */
export function parseDecimalString(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "0"
  const s = typeof value === "number" ? String(value) : String(value).trim()
  if (!s) return "0"
  return s
}

/** Format fractional growth (e.g. 0.12 -> +12%) for display */
export function formatGrowthFraction(fraction: string, decimals = 1): string {
  const n = Number(fraction)
  if (!Number.isFinite(n)) return fraction
  const pct = n * 100
  const sign = pct > 0 ? "+" : ""
  return sign + pct.toFixed(decimals) + "%"
}

export function formatMoneyAmount(amountStr: string, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Number(amountStr))
  } catch {
    return parseFloat(amountStr).toFixed(2) + " " + currency
  }
}
