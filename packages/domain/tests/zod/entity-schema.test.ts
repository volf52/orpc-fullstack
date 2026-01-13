import { describe, expect, it } from "bun:test"
import { defineEntitySchema } from "@domain/utils/zod/entity-schema"
import { z } from "zod/v4"

describe("Entity Schema", () => {
  const UserSchema = defineEntitySchema("UserId", {
    name: z.string().min(1),
  })

  it("should provide baseInit fields compatible with schema", () => {
    const base = UserSchema.baseInit()
    const parsed = UserSchema.parse({ ...base, name: "Ada" })
    expect(parsed.id).toBeString()
    expect(parsed.createdAt).toBeInstanceOf(Date)
    expect(parsed.updatedAt).toBeInstanceOf(Date)
  })

  it("should encode DateTime fields to unix milliseconds", () => {
    const base = UserSchema.baseInit()
    const encoded = z.encode(UserSchema, { ...base, name: "Ada" })
    expect(encoded.createdAt).toBeNumber()
    expect(encoded.updatedAt).toBeNumber()
  })
})
