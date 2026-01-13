import { describe, expect, expectTypeOf, it, test } from "bun:test"
import { Option } from "@carbonteq/fp"
import { DateTime, Opt, UUID } from "@domain/utils/zod/refined-types"
import { z } from "zod/v4"

// console.debug("Expect: false, actual: ", bridge.deserialize("abc").isOk())
//   console.debug("Expect: false, actual: ", bridge.deserialize(-123).isOk())
//   console.debug(
//     "Expect: false, actual: ",
//     bridge.deserialize(new Date("abc")).isOk(),
//   )
//   console.debug("Expect: false, actual: ", bridge.deserialize({}).isOk())

//   console.debug("Expect: true, actual: ", bridge.deserialize(new Date()).isOk())
//   console.debug("Expect: true, actual: ", bridge.deserialize(Date.now()).isOk())
//   console.debug(
//     "Expect: true, actual: ",
//     bridge.deserialize(new Date().toISOString()).isOk(),
//   )

//   console.debug("Encode: ", bridge.serialize(new Date()))

describe("Refined Types", () => {
  describe("UUID", () => {
    it("should parse valid uuid strings", () => {
      const id = UUID.parse("550e8400-e29b-41d4-a716-446655440000")
      expect(id).toBeString()
    })

    it("should reject invalid uuid strings", () => {
      expect(() => UUID.parse("not-a-uuid")).toThrow()
    })

    it("should generate new uuids", () => {
      const id = UUID.new()
      expect(UUID.safeParse(id).success).toBe(true)
    })
  })

  describe("DateTime", () => {
    it("should parse valid date-time strings", () => {
      const validDateTime = "2023-10-05T14:48:00.000Z"
      const parsed = DateTime.parse(validDateTime)
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed.toISOString()).toBe(validDateTime)
      expectTypeOf(parsed).toEqualTypeOf<Date>()
    })

    it("should parse valid unix timestamps", () => {
      const validTimestamp = Date.now()
      const parsed = DateTime.parse(validTimestamp)
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed.getTime()).toBe(validTimestamp)
      expectTypeOf(parsed).toEqualTypeOf<Date>()
    })

    it("should parse valid dates", () => {
      const validDate = new Date()
      const parsed = DateTime.parse(validDate)
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed.toISOString()).toBe(validDate.toISOString())
      expectTypeOf(parsed).toEqualTypeOf<Date>()
    })

    it("should reject invalid date-time strings", () => {
      const invalidDateTime = "invalid-date-time"
      expect(() => DateTime.parse(invalidDateTime)).toThrow()
    })

    it("should reject invalid unix timestamps", () => {
      const invalidTimestamp = -12345678901234
      expect(() => DateTime.parse(invalidTimestamp)).toThrow()
    })

    it("should reject invalid dates", () => {
      const invalidDate = new Date("invalid-date")
      expect(() => DateTime.parse(invalidDate)).toThrow()
    })

    const invalidInputs = [
      {},
      null,
      undefined,
      true,
      false,
      "abdawdawd",
      new Date("foo-bar"),
    ]

    test.each(invalidInputs)("should reject %p", (p) => {
      const parseInput = () => DateTime.parse(p)
      expect(parseInput).toThrow()
    })

    it("should encode dates to unix milliseconds", () => {
      const date = new Date("2023-10-05T14:48:00.000Z")
      const encoded = z.encode(DateTime, date)
      expect(encoded).toBeNumber()
      expect(encoded).toBe(date.getTime())
    })
  })

  describe("Opt", () => {
    const schema = Opt(z.string().min(1))

    it("should decode null to Option.None", () => {
      const parsed = schema.parse(null)
      expect(parsed).toBeInstanceOf(Option)
      expect(parsed.isNone()).toBe(true)
    })

    it("should decode value to Option.Some", () => {
      const parsed = schema.parse("hello")
      expect(parsed.isSome()).toBe(true)
      expect(parsed.unwrap()).toBe("hello")
    })

    it("should encode Option.None to null", () => {
      const encoded = z.encode(schema, Option.None)
      expect(encoded).toBeNull()
    })

    it("should encode Option.Some to inner value", () => {
      const encoded = z.encode(schema, Option.Some("hello"))
      expect(encoded).toBe("hello")
    })

    it("should reject non-option output", () => {
      // @ts-expect-error intentional invalid value
      expect(() => z.encode(schema, "hello")).toThrow()
    })
  })
})
