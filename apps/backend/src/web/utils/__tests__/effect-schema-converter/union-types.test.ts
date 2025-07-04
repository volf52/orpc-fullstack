import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Union Types", () => {
  describe("Basic unions", () => {
    test("should convert union of primitive types", () => {
      const schema = S.Union(S.String, S.Number)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [{ type: "string" }, { type: "number" }],
      })
    })

    test("should convert union of literals as enum", () => {
      const schema = S.Union(
        S.Literal("active"),
        S.Literal("inactive"),
        S.Literal("pending"),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "string",
        enum: ["active", "inactive", "pending"],
      })
    })

    test("should convert union of mixed literal types", () => {
      const schema = S.Union(S.Literal("active"), S.Literal(1), S.Literal(true))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [
          { type: "string", enum: ["active"] },
          { type: "number", enum: [1] },
          { type: "boolean", enum: [true] },
        ],
      })
    })

    test("should convert union of object types", () => {
      const schema = S.Union(
        S.Struct({
          type: S.Literal("user"),
          name: S.String,
        }),
        S.Struct({
          type: S.Literal("admin"),
          permissions: S.Array(S.String),
        }),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["user"] },
              name: { type: "string" },
            },
            required: ["type", "name"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["admin"] },
              permissions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["type", "permissions"],
          },
        ],
      })
    })

    test("should convert union with null", () => {
      const schema = S.Union(S.String, S.Null)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [{ type: "string" }, { type: "null" }],
      })
    })

    test("should convert nullable type", () => {
      const schema = S.NullOr(S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [{ type: "string" }, { type: "null" }],
      })
    })

    test("should convert undefinable type", () => {
      const schema = S.UndefinedOr(S.String)
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [{ type: "string" }, { type: "undefined" }],
      })
    })
  })

  describe("Complex unions", () => {
    test("should convert union of arrays", () => {
      const schema = S.Union(S.Array(S.String), S.Array(S.Number))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [
          {
            type: "array",
            items: { type: "string" },
          },
          {
            type: "array",
            items: { type: "number" },
          },
        ],
      })
    })

    test("should convert union with nested unions", () => {
      const schema = S.Union(S.String, S.Union(S.Number, S.Boolean))
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [
          { type: "string" },
          {
            oneOf: [{ type: "number" }, { type: "boolean" }],
          },
        ],
      })
    })

    test("should convert union with annotations", () => {
      const schema = S.Union(S.String, S.Number).annotations({
        title: "String or Number",
        description: "Can be either a string or number",
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [{ type: "string" }, { type: "number" }],
        title: "String or Number",
        description: "Can be either a string or number",
      })
    })
  })

  describe("Discriminated unions", () => {
    test("should convert discriminated union", () => {
      const schema = S.Union(
        S.Struct({
          kind: S.Literal("circle"),
          radius: S.Number,
        }),
        S.Struct({
          kind: S.Literal("rectangle"),
          width: S.Number,
          height: S.Number,
        }),
      )
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        oneOf: [
          {
            type: "object",
            properties: {
              kind: { type: "string", enum: ["circle"] },
              radius: { type: "number" },
            },
            required: ["kind", "radius"],
          },
          {
            type: "object",
            properties: {
              kind: { type: "string", enum: ["rectangle"] },
              width: { type: "number" },
              height: { type: "number" },
            },
            required: ["kind", "width", "height"],
          },
        ],
        discriminator: {
          propertyName: "kind",
        },
      })
    })
  })
})
