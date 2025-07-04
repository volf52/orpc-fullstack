import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Primitive Types", () => {
  describe("String types", () => {
    test("should convert basic string schema", () => {
      const schema = S.String
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
      })
    })

    test("should convert string with minLength constraint", () => {
      const schema = S.String.pipe(S.minLength(5))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 5,
      })
    })

    test("should convert string with maxLength constraint", () => {
      const schema = S.String.pipe(S.maxLength(10))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        maxLength: 10,
      })
    })

    test("should convert string with both min and max length constraints", () => {
      const schema = S.String.pipe(S.minLength(5), S.maxLength(10))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 5,
        maxLength: 10,
      })
    })

    test("should convert string with length constraint", () => {
      const schema = S.String.pipe(S.length(8))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 8,
        maxLength: 8,
      })
    })

    test("should convert string with pattern constraint", () => {
      const schema = S.String.pipe(S.pattern(/^[a-z]+$/))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        pattern: "^[a-z]+$",
      })
    })

    test("should convert NonEmptyString", () => {
      const schema = S.NonEmptyString
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 1,
      })
    })

    test("should convert string with annotations", () => {
      const schema = S.String.annotations({
        title: "User Name",
        description: "The name of the user",
        examples: ["John Doe", "Jane Smith"],
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        title: "User Name",
        description: "The name of the user",
        examples: ["John Doe", "Jane Smith"],
      })
    })
  })

  describe("Number types", () => {
    test("should convert basic number schema", () => {
      const schema = S.Number
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
      })
    })

    test("should convert number with minimum constraint", () => {
      const schema = S.Number.pipe(S.greaterThanOrEqualTo(0))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        minimum: 0,
      })
    })

    test("should convert number with maximum constraint", () => {
      const schema = S.Number.pipe(S.lessThanOrEqualTo(100))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        maximum: 100,
      })
    })

    test("should convert number with exclusive minimum constraint", () => {
      const schema = S.Number.pipe(S.greaterThan(0))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        minimum: 0,
        exclusiveMinimum: true,
      })
    })

    test("should convert number with exclusive maximum constraint", () => {
      const schema = S.Number.pipe(S.lessThan(100))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        maximum: 100,
        exclusiveMaximum: true,
      })
    })

    test("should convert number with range constraints", () => {
      const schema = S.Number.pipe(S.between(0, 100))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        minimum: 0,
        maximum: 100,
      })
    })

    test("should convert integer with constraints", () => {
      const schema = S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "integer",
        minimum: 0,
      })
    })

    test("should convert number with multipleOf constraint", () => {
      const schema = S.Number.pipe(S.multipleOf(5))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        multipleOf: 5,
      })
    })
  })

  describe("Boolean types", () => {
    test("should convert basic boolean schema", () => {
      const schema = S.Boolean
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "boolean",
      })
    })

    test("should convert boolean with annotations", () => {
      const schema = S.Boolean.annotations({
        title: "Is Active",
        description: "Whether the user is active",
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "boolean",
        title: "Is Active",
        description: "Whether the user is active",
      })
    })
  })

  describe("Literal types", () => {
    test("should convert string literal", () => {
      const schema = S.Literal("active")
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        enum: ["active"],
      })
    })

    test("should convert number literal", () => {
      const schema = S.Literal(42)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        enum: [42],
      })
    })

    test("should convert boolean literal", () => {
      const schema = S.Literal(true)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "boolean",
        enum: [true],
      })
    })
  })

  describe("Null and Undefined types", () => {
    test("should convert null schema", () => {
      const schema = S.Null
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "null",
      })
    })

    test("should convert undefined schema", () => {
      const schema = S.Undefined
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({})
    })
  })
})
