import { describe, expect, it } from "bun:test"
import { ValidationError } from "@domain/utils/base.errors"
import { validationErrorsToSingle } from "@domain/utils/validation.utils"
import { zodErrorToValidationError } from "@domain/utils/zod/error-mapper"
import { z } from "zod/v4"

describe("Validation Error Utils", () => {
  describe("zodErrorToValidationError", () => {
    it("should map Zod errors to ValidationError", () => {
      const TestSchema = z.object({
        name: z.string().min(1),
        age: z.number().positive(),
        email: z.string().min(5),
      })

      const result = TestSchema.safeParse({
        name: "",
        age: -5,
        email: "a",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const validationResult = zodErrorToValidationError(result.error)

        expect(validationResult).toBeInstanceOf(ValidationError)
        expect(validationResult.issues.length).toBeGreaterThan(0)
        expect(validationResult.message).toContain("Validation failed")
      }
    })
  })

  describe("validationErrorsToSingle", () => {
    it("should handle empty array", () => {
      const result = validationErrorsToSingle([])

      expect(result).toBeInstanceOf(ValidationError)
      expect(result.message).toBe("Unknown validation error")
    })

    it("should return single error unchanged", () => {
      const error = ValidationError.single("Test error", "field1")
      const result = validationErrorsToSingle([error])

      expect(result).toBe(error)
    })

    it("should combine multiple errors", () => {
      const error1 = ValidationError.single("Error 1", "field1")
      const error2 = ValidationError.single("Error 2", "field2")

      const result = validationErrorsToSingle([error1, error2])

      expect(result).toBeInstanceOf(ValidationError)
      expect(result.issues).toHaveLength(2)
      expect(result.issues[0]?.message).toBe("Error 1")
      expect(result.issues[1]?.message).toBe("Error 2")
    })
  })

  describe("ValidationError enhanced features", () => {
    it("should create single validation error", () => {
      const error = ValidationError.single(
        "Test message",
        "testField",
        "testValue",
      )

      expect(error.message).toBe("Test message")
      expect(error.field).toBe("testField")
      expect(error.value).toBe("testValue")
      expect(error.issues).toHaveLength(1)
      expect(error.issues[0]?.field).toBe("testField")
    })

    it("should create multiple validation error", () => {
      const issues = [
        { message: "Issue 1", field: "field1", value: "value1" },
        { message: "Issue 2", field: "field2", value: "value2" },
      ]

      const error = ValidationError.multiple(issues)

      expect(error.issues).toHaveLength(2)
      expect(error.message).toContain("Validation failed with 2 error(s)")
      expect(error.field).toBe("field1") // Backward compatibility
      expect(error.value).toBe("value1") // Backward compatibility
    })
  })
})
