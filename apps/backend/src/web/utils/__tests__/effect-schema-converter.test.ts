import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../effect-schema-converter"

// Import all test suites
import "./effect-schema-converter/primitive-types.test"
import "./effect-schema-converter/object-types.test"
import "./effect-schema-converter/array-types.test"
import "./effect-schema-converter/union-types.test"
import "./effect-schema-converter/complex-schemas.test"
import "./effect-schema-converter/error-handling.test"

describe("Effect Schema Converter - Integration", () => {
  test("should have the main export function", () => {
    expect(typeof convertEffectSchemaToOpenAPI).toBe("function")
  })

  test("should convert a basic schema end-to-end", () => {
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
})
