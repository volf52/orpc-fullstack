import { describe, expect, test } from "bun:test"
import { zodErrorToValidationError } from "@domain/utils/zod/error-mapper"
import { z } from "zod/v4"

describe("ParseError to ValidationError Conversion", () => {
  // Test schema with various validation scenarios
  const testSchema = z.object({
    // String with length validation
    name: z.string().min(3).max(20),

    // Number with range validation
    age: z.number().int().min(0).max(150),

    // Required boolean
    isActive: z.boolean(),

    // Optional string with pattern
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).optional(),

    // Nested object
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(2),
      zipCode: z.string().regex(/^\d{5}$/),
      country: z.string().min(2),
    }),

    // Array validation
    tags: z.array(z.string().min(1)),

    // Date validation
    birthDate: z.date(),

    // Union type
    role: z.enum(["admin", "user", "guest"]),
  })

  test("Multiple validation errors", () => {
    const data = {
      name: "Jo", // Too short
      age: 200, // Too high
      isActive: "not-boolean", // Wrong type
      email: "invalid-email", // Invalid format
      address: {
        street: "", // Too short
        city: "A", // Too short
        zipCode: "123", // Invalid format
        country: "X", // Too short
      },
      tags: ["", "valid-tag"], // Empty string in array
      birthDate: "invalid-date", // Invalid date
      role: "invalid-role", // Invalid union value
    }

    const expectedFields = [
      "name",
      "age",
      "isActive",
      "email",
      "address.street",
      "address.city",
      "address.zipCode",
      "address.country",
      "tags.0",
      "birthDate",
      "role",
    ]

    const result = testSchema.safeParse(data)

    expect(result.success).toBe(false)

    if (!result.success) {
      const validationError = zodErrorToValidationError(result.error)

      expect(validationError.issues.length).toBeGreaterThan(1)

      const actualFields = validationError.issues
        .map((issue) => issue.field)
        .filter(Boolean) as string[]

      // Check that we have proper field names
      expectedFields.forEach((field) => {
        expect(actualFields).toContain(field)
      })

      // Check that each issue has a message
      validationError.issues.forEach((issue) => {
        expect(issue.message).toBeDefined()
        expect(issue.message.length).toBeGreaterThan(0)
      })

      // Check that each issue has a path
      validationError.issues.forEach((issue) => {
        expect(issue.path).toBeDefined()
        expect(issue.path?.length).toBeGreaterThan(0)
      })
    }
  })

  test("Missing required fields", () => {
    const data = {
      // Missing name, age, isActive, address, tags, birthDate, role
      email: "test@example.com",
    }

    const expectedFields = [
      "name",
      "age",
      "isActive",
      "address",
      "tags",
      "birthDate",
      "role",
    ]

    const result = testSchema.safeParse(data)

    expect(result.success).toBe(false)

    if (!result.success) {
      const validationError = zodErrorToValidationError(result.error)

      expect(validationError.issues.length).toBeGreaterThan(1)

      const actualFields = validationError.issues
        .map((issue) => issue.field)
        .filter(Boolean) as string[]

      expectedFields.forEach((field) => {
        expect(actualFields).toContain(field)
      })
    }
  })

  test("Nested object missing fields", () => {
    const data = {
      name: "John",
      age: 25,
      isActive: true,
      address: {
        // Missing street, city, zipCode, country
      },
      tags: ["tag1"],
      birthDate: new Date(),
      role: "user",
    }

    const expectedFields = [
      "address.street",
      "address.city",
      "address.zipCode",
      "address.country",
    ]

    const result = testSchema.safeParse(data)

    expect(result.success).toBe(false)

    if (!result.success) {
      const validationError = zodErrorToValidationError(result.error)

      const actualFields = validationError.issues
        .map((issue) => issue.field)
        .filter(Boolean) as string[]

      expectedFields.forEach((field) => {
        expect(actualFields).toContain(field)
      })
    }
  })

  test("Type errors", () => {
    const data = {
      name: 123, // Should be string
      age: "not-a-number", // Should be number
      isActive: "yes", // Should be boolean
      address: "not-an-object", // Should be object
      tags: "not-an-array", // Should be array
      birthDate: 123, // Should be date
      role: 456, // Should be string literal
    }

    const expectedFields = [
      "name",
      "age",
      "isActive",
      "address",
      "tags",
      "birthDate",
      "role",
    ]

    const result = testSchema.safeParse(data)

    expect(result.success).toBe(false)

    if (!result.success) {
      const validationError = zodErrorToValidationError(result.error)

      const actualFields = validationError.issues
        .map((issue) => issue.field)
        .filter(Boolean) as string[]

      expectedFields.forEach((field) => {
        expect(actualFields).toContain(field)
      })
    }
  })

  test("Array validation errors", () => {
    const data = {
      name: "John",
      age: 25,
      isActive: true,
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345",
        country: "US",
      },
      tags: ["", "valid", "", "also-valid"], // Empty strings should fail
      birthDate: new Date(),
      role: "user",
    }

    const expectedFields = ["tags.0", "tags.2"]

    const result = testSchema.safeParse(data)

    expect(result.success).toBe(false)

    if (!result.success) {
      const validationError = zodErrorToValidationError(result.error)

      const actualFields = validationError.issues
        .map((issue) => issue.field)
        .filter(Boolean) as string[]

      expectedFields.forEach((field) => {
        expect(actualFields).toContain(field)
      })
    }
  })

  describe("Edge Cases", () => {
    test("Simple string validation", () => {
      const simpleSchema = z.string().min(5)
      const result = simpleSchema.safeParse("hi")

      expect(result.success).toBe(false)

      if (!result.success) {
        const validationError = zodErrorToValidationError(result.error)

        expect(validationError.issues.length).toBeGreaterThan(0)
        const issue = validationError.issues[0]
        expect(issue?.message).toBeDefined()
        expect(issue?.message).toContain("5")
      }
    })

    test("Nested array validation", () => {
      const nestedArraySchema = z.object({
        users: z.array(
          z.object({
            name: z.string().min(2),
            email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          }),
        ),
      })

      const result = nestedArraySchema.safeParse({
        users: [
          { name: "A", email: "invalid" },
          { name: "Valid Name", email: "valid@email.com" },
          { name: "B", email: "also-invalid" },
        ],
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        const validationError = zodErrorToValidationError(result.error)

        expect(validationError.issues.length).toBeGreaterThan(0)

        const actualFields = validationError.issues
          .map((issue) => issue.field)
          .filter(Boolean) as string[]

        // Should have fields like "users.0.name", "users.0.email", "users.2.name", "users.2.email"
        expect(actualFields.some((field) => field.includes("users.0"))).toBe(
          true,
        )
        expect(actualFields.some((field) => field.includes("users.2"))).toBe(
          true,
        )
      }
    })

    test("Refinement validation", () => {
      const refinementSchema = z.string().min(3).max(10)
      const result = refinementSchema.safeParse("ab")

      expect(result.success).toBe(false)

      if (!result.success) {
        const validationError = zodErrorToValidationError(result.error)

        expect(validationError.issues.length).toBeGreaterThan(0)
        expect(validationError.issues[0]?.message).toBeDefined()
        expect(validationError.issues[0]?.message.length).toBeGreaterThan(0)
      }
    })

    test("Union validation", () => {
      const unionSchema = z.enum(["A", "B", "C"])
      const result = unionSchema.safeParse("D")

      expect(result.success).toBe(false)

      if (!result.success) {
        const validationError = zodErrorToValidationError(result.error)

        expect(validationError.issues.length).toBeGreaterThan(0)
        expect(validationError.issues[0]?.message).toBeDefined()
        expect(validationError.issues[0]?.message.length).toBeGreaterThan(0)
      }
    })
  })
})
