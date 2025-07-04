import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Object Types", () => {
  describe("Basic objects", () => {
    test("should convert simple object schema", () => {
      const schema = S.Struct({
        name: S.String,
        age: S.Number,
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name", "age"],
      })
    })

    test("should convert object with optional fields", () => {
      const schema = S.Struct({
        name: S.String,
        age: S.optional(S.Number),
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name"],
      })
    })

    test("should convert object with all optional fields", () => {
      const schema = S.Struct({
        name: S.optional(S.String),
        age: S.optional(S.Number),
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: [],
      })
    })

    test("should convert nested object schema", () => {
      const schema = S.Struct({
        user: S.Struct({
          name: S.String,
          email: S.String,
        }),
        settings: S.Struct({
          theme: S.String,
          notifications: S.Boolean,
        }),
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
            },
            required: ["name", "email"],
          },
          settings: {
            type: "object",
            properties: {
              theme: { type: "string" },
              notifications: { type: "boolean" },
            },
            required: ["theme", "notifications"],
          },
        },
        required: ["user", "settings"],
      })
    })

    test("should convert object with mixed field types", () => {
      const schema = S.Struct({
        id: S.Number,
        name: S.String,
        active: S.Boolean,
        tags: S.Array(S.String),
        metadata: S.optional(
          S.Struct({
            createdAt: S.String,
            updatedAt: S.String,
          }),
        ),
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          active: { type: "boolean" },
          tags: {
            type: "array",
            items: { type: "string" },
          },
          metadata: {
            type: "object",
            properties: {
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
            required: ["createdAt", "updatedAt"],
          },
        },
        required: ["id", "name", "active", "tags"],
      })
    })

    test("should convert object with annotations", () => {
      const schema = S.Struct({
        name: S.String,
        age: S.Number,
      }).annotations({
        title: "User",
        description: "A user object",
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name", "age"],
        title: "User",
        description: "A user object",
      })
    })
  })

  describe("Record types", () => {
    test("should convert record with string values", () => {
      const schema = S.Record({ key: S.String, value: S.String })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        additionalProperties: { type: "string" },
      })
    })

    test("should convert record with number values", () => {
      const schema = S.Record({ key: S.String, value: S.Number })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        additionalProperties: { type: "number" },
      })
    })

    test("should convert record with object values", () => {
      const schema = S.Record({
        key: S.String,
        value: S.Struct({
          name: S.String,
          count: S.Number,
        }),
      })
      const result = convertEffectSchemaToOpenAPI(schema)

      expect(result).toEqual({
        type: "object",
        additionalProperties: {
          type: "object",
          properties: {
            name: { type: "string" },
            count: { type: "number" },
          },
          required: ["name", "count"],
        },
      })
    })
  })
})
