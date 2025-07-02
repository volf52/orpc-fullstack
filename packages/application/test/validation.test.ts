import { describe, test, expect } from "bun:test"
import { Schema as S } from "effect"
import { validateWithEffect } from "../src/utils/validation.utils"

describe("Validation Utils", () => {
  const testSchema = S.Struct({
    name: S.NonEmptyString,
    age: S.Number.pipe(S.greaterThanOrEqualTo(0)),
    email: S.String.pipe(S.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  })

  test("should validate correct data", () => {
    const validData = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    }

    const result = validateWithEffect(testSchema, validData)

    expect(result.isOk()).toBe(true)
    expect(result.unwrap()).toEqual(validData)
  })

  test("should return validation error for invalid data", () => {
    const invalidData = {
      name: "",
      age: -5,
      email: "not-an-email",
    }

    const result = validateWithEffect(testSchema, invalidData)

    expect(result.isErr()).toBe(true)
    const error = result.unwrapErr()
    expect(error.name).toBe("ValidationError")
    expect(error.message).toContain("NonEmptyString")
  })

  test("should handle missing fields", () => {
    const incompleteData = {
      name: "John Doe",
      // missing age and email
    }

    const result = validateWithEffect(testSchema, incompleteData)

    expect(result.isErr()).toBe(true)
    const error = result.unwrapErr()
    expect(error.name).toBe("ValidationError")
  })

  test("should handle null/undefined input", () => {
    const result1 = validateWithEffect(testSchema, null)
    const result2 = validateWithEffect(testSchema, undefined)

    expect(result1.isErr()).toBe(true)
    expect(result2.isErr()).toBe(true)
  })
})
