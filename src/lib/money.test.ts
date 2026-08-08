import { describe, expect, it } from "vitest"

import { formatGrowthFraction, parseDecimalString } from "./money"

describe("money helpers", () => {
  it("parses decimal strings", () => {
    expect(parseDecimalString("12.34")).toBe("12.34")
    expect(parseDecimalString("")).toBe("0")
  })

  it("formats growth fraction", () => {
    expect(formatGrowthFraction("0.1")).toBe("+10.0%")
    expect(formatGrowthFraction("-0.05")).toBe("-5.0%")
  })
})
