import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Array Types", () => {
  describe("Basic arrays", () => {
    test("should convert array of strings", () => {
      const schema = S.Array(S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
      })
    })

    test("should convert array of numbers", () => {
      const schema = S.Array(S.Number)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "number" },
      })
    })

    test("should convert array of booleans", () => {
      const schema = S.Array(S.Boolean)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "boolean" },
      })
    })

    test("should convert array of objects", () => {
      const schema = S.Array(
        S.Struct({
          id: S.Number,
          name: S.String,
        }),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
          },
          required: ["id", "name"],
        },
      })
    })

    test("should convert nested arrays", () => {
      const schema = S.Array(S.Array(S.String))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: {
          type: "array",
          items: { type: "string" },
        },
      })
    })
  })

  describe("Array constraints", () => {
    test("should convert array with minItems constraint", () => {
      const schema = S.Array(S.String).pipe(S.minItems(1))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        minItems: 1,
      })
    })

    test("should convert array with maxItems constraint", () => {
      const schema = S.Array(S.String).pipe(S.maxItems(10))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        maxItems: 10,
      })
    })

    test("should convert array with both min and max items constraints", () => {
      const schema = S.Array(S.String).pipe(S.minItems(1), S.maxItems(10))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        minItems: 1,
        maxItems: 10,
      })
    })

    test("should convert array with itemsCount constraint", () => {
      const schema = S.Array(S.String).pipe(S.itemsCount(5))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        minItems: 5,
        maxItems: 5,
      })
    })

    test("should convert NonEmptyArray", () => {
      const schema = S.NonEmptyArray(S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        minItems: 1,
      })
    })
  })

  describe("Array with annotations", () => {
    test("should convert array with annotations", () => {
      const schema = S.Array(S.String).annotations({
        title: "Tags",
        description: "List of tags",
        examples: [["tag1", "tag2"]],
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        title: "Tags",
        description: "List of tags",
        examples: [["tag1", "tag2"]],
      })
    })
  })

  describe("Tuple types", () => {
    test("should convert tuple with different types", () => {
      const schema = S.Tuple(S.String, S.Number, S.Boolean)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
        minItems: 3,
        maxItems: 3,
      })
    })

    test("should convert tuple with optional elements", () => {
      const schema = S.Tuple(S.String, S.optionalElement(S.Number))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
        minItems: 1,
        maxItems: 2,
      })
    })

    test("should convert tuple with rest elements", () => {
      const schema = S.Tuple([S.String, S.Number], S.Boolean)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
        additionalItems: { type: "boolean" },
        minItems: 2,
      })
    })
  })
})
