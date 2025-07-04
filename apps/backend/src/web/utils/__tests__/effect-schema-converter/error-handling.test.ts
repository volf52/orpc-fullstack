import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Error Handling & Edge Cases", () => {
  describe("Error handling", () => {
    test("should throw meaningful error for unsupported schema types", () => {
      // Create a schema that might not be supported
      const schema = S.Unknown

      expect(() => convertEffectSchemaToOpenAPI(schema)).toThrow()
    })

    test("should handle empty object schemas", () => {
      const schema = S.Struct({})
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {},
        required: [],
      })
    })

    test("should handle deeply nested schemas", () => {
      const schema = S.Struct({
        level1: S.Struct({
          level2: S.Struct({
            level3: S.Struct({
              level4: S.Struct({
                value: S.String,
              }),
            }),
          }),
        }),
      })

      expect(() => convertEffectSchemaToOpenAPI(schema)).not.toThrow()
      const result = convertEffectSchemaToOpenAPI(schema)
      expect(result.type).toBe("object")
    })

    test("should handle circular references gracefully", () => {
      // This might cause infinite recursion if not handled properly
      interface Node {
        readonly id: string
        readonly children?: readonly Node[]
      }

      const NodeSchema: S.Schema<Node> = S.Struct({
        id: S.String,
        children: S.optional(S.Array(S.suspend(() => NodeSchema))),
      })

      expect(() => convertEffectSchemaToOpenAPI(NodeSchema)).not.toThrow()
    })
  })

  describe("Edge cases", () => {
    test("should handle arrays with maxItems constraint", () => {
      const schema = S.Array(S.String).pipe(S.maxItems(1))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "array",
        items: { type: "string" },
        maxItems: 1,
        description: "an array of at most 1 item(s)",
      })
    })

    test("should handle very large number constraints", () => {
      const schema = S.Number.pipe(S.lessThanOrEqualTo(Number.MAX_SAFE_INTEGER))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        maximum: Number.MAX_SAFE_INTEGER,
      })
    })

    test("should handle very small number constraints", () => {
      const schema = S.Number.pipe(
        S.greaterThanOrEqualTo(Number.MIN_SAFE_INTEGER),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "number",
        minimum: Number.MIN_SAFE_INTEGER,
      })
    })

    test("should handle empty string constraints", () => {
      const schema = S.String.pipe(S.maxLength(0))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        maxLength: 0,
      })
    })

    test("should handle union with single type", () => {
      const schema = S.Union(S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
      })
    })

    test("should handle union with duplicate types", () => {
      const schema = S.Union(S.String, S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
      })
    })

    test("should handle complex regex patterns", () => {
      const schema = S.String.pipe(
        S.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result.type).toBe("string")
      expect(result.pattern).toBeDefined()
    })

    test("should handle multiple constraints on same field", () => {
      const schema = S.String.pipe(
        S.minLength(5),
        S.maxLength(100),
        S.pattern(/^[a-zA-Z0-9_-]+$/),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 5,
        maxLength: 100,
        pattern: "^[a-zA-Z0-9_-]+$",
      })
    })

    test("should handle conflicting constraints gracefully", () => {
      // This might create logically impossible constraints
      const schema = S.String.pipe(S.minLength(10), S.maxLength(5))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        minLength: 10,
        maxLength: 5,
      })
    })
  })

  describe("Annotation edge cases", () => {
    test("should handle empty annotations", () => {
      const schema = S.String.annotations({})
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
      })
    })

    test("should handle null/undefined annotation values", () => {
      const schema = S.String.annotations({
        title: undefined,
        description: null as any,
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result.type).toBe("string")
      expect(result.title).toBeUndefined()
      expect(result.description).toBeUndefined()
    })

    test("should handle very long annotation strings", () => {
      const longString = "a".repeat(10000)
      const schema = S.String.annotations({
        title: longString,
        description: longString,
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result.title).toBe(longString)
      expect(result.description).toBe(longString)
    })

    test("should handle special characters in annotations", () => {
      const schema = S.String.annotations({
        title: "Special chars: !@#$%^&*()_+-={}[]|\\:;\"'<>?,./",
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result.title).toBe(
        "Special chars: !@#$%^&*()_+-={}[]|\\:;\"'<>?,./",
      )
    })
  })
})
