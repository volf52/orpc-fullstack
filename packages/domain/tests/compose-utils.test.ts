import { describe, expect, test } from "bun:test"
import { ComposeUtils } from "@domain/utils/compose.utils"

describe("ComposeUtils.mergeMul", () => {
  test("merges multiple objects", () => {
    const merge = ComposeUtils.mergeMul({ a: 1 }, { b: 2 }, { c: 3 })
    const result = merge({ d: 4 })
    expect(result).toEqual({ d: 4, a: 1, b: 2, c: 3 })
  })

  test("does not mutate base object", () => {
    const base = { a: 1 }
    const merge = ComposeUtils.mergeMul({ b: 2 })
    const result = merge(base)
    expect(base).toEqual({ a: 1 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  test("handles empty input", () => {
    const merge = ComposeUtils.mergeMul()
    const base = { a: 1 }
    const result = merge(base)
    expect(result).toEqual({ a: 1 })
  })
})
