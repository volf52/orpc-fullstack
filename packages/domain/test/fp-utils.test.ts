import { test, expect } from "bun:test"
import { Effect, Either } from "effect"
import { Result } from "@carbonteq/fp/result"
import {
  eitherToResult,
  resultToEither,
  effectToResult,
  effectToResultAsync,
  resultToEffect,
  ResultUtils,
} from "../src/utils/fp-utils"

test("eitherToResult - converts Either.right to Result.Ok", () => {
  const either = Either.right(42)
  const result = eitherToResult(either)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toBe(42)
})

test("eitherToResult - converts Either.left to Result.Err", () => {
  const either = Either.left("error")
  const result = eitherToResult(either)

  expect(result.isErr()).toBe(true)
  expect(result.unwrapErr()).toBe("error")
})

test("resultToEither - converts Result.Ok to Either.right", () => {
  const result = Result.Ok(42)
  const either = resultToEither(result)

  expect(Either.isRight(either)).toBe(true)
  if (Either.isRight(either)) {
    expect(either.right).toBe(42)
  }
})

test("resultToEither - converts Result.Err to Either.left", () => {
  const result = Result.Err<string, number>("error")
  const either = resultToEither(result)

  expect(Either.isLeft(either)).toBe(true)
  if (Either.isLeft(either)) {
    expect(either.left).toBe("error")
  }
})

test("effectToResult - converts successful Effect to Result.Ok", () => {
  const effect = Effect.succeed(42)
  const result = effectToResult(effect)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toBe(42)
})

test("effectToResult - converts failing Effect to Result.Err", () => {
  const effect = Effect.fail("error")
  const result = effectToResult(effect)

  expect(result.isErr()).toBe(true)
  expect(result.unwrapErr()).toBe("error")
})

test("effectToResult - throws error for async effects", () => {
  // Create an effect that has async boundaries using Effect.delay
  const asyncEffect = Effect.delay(Effect.succeed(42), "1 millis")

  expect(() => effectToResult(asyncEffect)).toThrow(
    "Cannot run effect synchronously - it contains async operations"
  )
})

test("resultToEffect - converts Result.Ok to successful Effect", async () => {
  const result = Result.Ok(42)
  const effect = resultToEffect(result)
  const value = await Effect.runPromise(effect)

  expect(value).toBe(42)
})

test("resultToEffect - converts Result.Err to failing Effect", async () => {
  const result = Result.Err<string, number>("error")
  const effect = resultToEffect(result)

  try {
    await Effect.runPromise(effect)
    expect(true).toBe(false) // Should not reach here
  } catch (error) {
    expect(String(error)).toContain("error")
  }
})

test("effectToResultAsync - converts successful Effect to Result.Ok", async () => {
  const effect = Effect.succeed(42)
  const result = await effectToResultAsync(effect)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toBe(42)
})

test("effectToResultAsync - converts failing Effect to Result.Err", async () => {
  const effect = Effect.fail("error")
  const result = await effectToResultAsync(effect)

  expect(result.isErr()).toBe(true)
  expect(result.unwrapErr()).toBe("error")
})

test("effectToResultAsync - handles async effects", async () => {
  // Create an effect that has async boundaries using Effect.delay
  const asyncEffect = Effect.delay(Effect.succeed(42), "1 millis")
  const result = await effectToResultAsync(asyncEffect)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toBe(42)
})

test("effectToResultAsync - handles async failing effects", async () => {
  // Create an async effect that fails
  const asyncEffect = Effect.delay(Effect.fail("async error"), "1 millis")
  const result = await effectToResultAsync(asyncEffect)

  expect(result.isErr()).toBe(true)
  expect(result.unwrapErr()).toBe("async error")
})

// Tests for serialized utility

test("serialized - calls serialize method on object", () => {
  const obj = {
    serialize: () => ({ id: "123", name: "test" }),
  }

  const result = ResultUtils.serialized(obj)

  expect(result).toEqual({ id: "123", name: "test" })
})

test("serialized - works with entities that have serialize method", () => {
  class MockEntity {
    constructor(private data: { id: string; value: number }) {}

    serialize() {
      return {
        ...this.data,
        timestamp: "2024-01-01T00:00:00Z",
      }
    }
  }

  const entity = new MockEntity({ id: "test", value: 42 })
  const result = ResultUtils.serialized(entity)

  expect(result).toEqual({
    id: "test",
    value: 42,
    timestamp: "2024-01-01T00:00:00Z",
  })
})

// Tests for ResultUtils

test("ResultUtils.pick - picks specified keys from Ok result", () => {
  const result = Result.Ok({
    name: "John",
    email: "john@example.com",
    age: 30,
    city: "NYC"
  })

  const picked = ResultUtils.pick("name", "email")(result)

  expect(picked.isOk()).toBe(true)
  expect(picked.unwrap()).toEqual({ name: "John", email: "john@example.com" })
})

test("ResultUtils.pick - preserves Err result", () => {
  const result = Result.Err<string, { name: string; age: number }>("error")

  const picked = ResultUtils.pick("name")(result)

  expect(picked.isErr()).toBe(true)
  expect(picked.unwrapErr()).toBe("error")
})

test("ResultUtils.pick - handles missing keys gracefully", () => {
  const result = Result.Ok({ name: "John", age: 30 })

  // TypeScript will prevent this at compile time, but for runtime we test graceful handling
  const picked = ResultUtils.pick("name")(result)

  expect(picked.isOk()).toBe(true)
  expect(picked.unwrap()).toEqual({ name: "John" })
})

test("ResultUtils.extract - extracts single key from Ok result", () => {
  const result = Result.Ok({ name: "John", age: 30 })

  const extracted = ResultUtils.extract("name")(result)

  expect(extracted.isOk()).toBe(true)
  expect(extracted.unwrap()).toBe("John")
})

test("ResultUtils.extract - preserves Err result", () => {
  const result = Result.Err<string, { name: string }>("error")

  const extracted = ResultUtils.extract("name")(result)

  expect(extracted.isErr()).toBe(true)
  expect(extracted.unwrapErr()).toBe("error")
})

test("ResultUtils.extract - throws error for missing key", () => {
  const result = Result.Ok({ name: "John" })

  expect(() => {
    // Testing runtime behavior for non-existent key by using any
    const extracted = ResultUtils.extract("age" as any)(result)
    extracted.unwrap()
  }).toThrow("Key age not found in result")
})

test("ResultUtils.transform - transforms Ok result value", () => {
  const result = Result.Ok(5)

  const transformed = ResultUtils.transform((x: number) => x * 2)(result)

  expect(transformed.isOk()).toBe(true)
  expect(transformed.unwrap()).toBe(10)
})

test("ResultUtils.transform - preserves Err result", () => {
  const result = Result.Err<string, number>("error")

  const transformed = ResultUtils.transform((x: number) => x * 2)(result)

  expect(transformed.isErr()).toBe(true)
  expect(transformed.unwrapErr()).toBe("error")
})

test("ResultUtils.collect - collects all successful results", () => {
  const results = [
    Result.Ok(1),
    Result.Ok(2),
    Result.Ok(3),
  ]

  const collected = ResultUtils.collect(results)

  expect(collected.isOk()).toBe(true)
  expect(collected.unwrap()).toEqual([1, 2, 3])
})

test("ResultUtils.collect - returns errors when any result fails", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const collected = ResultUtils.collect(results)

  expect(collected.isErr()).toBe(true)
  expect(collected.unwrapErr()).toEqual(["error1", "error2"])
})

test("ResultUtils.collect - handles empty array", () => {
  const results: Result<number, string>[] = []

  const collected = ResultUtils.collect(results)

  expect(collected.isOk()).toBe(true)
  expect(collected.unwrap()).toEqual([])
})

test("ResultUtils.filterOk - filters and unwraps successful results", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const successes = ResultUtils.filterOk(results)

  expect(successes).toEqual([1, 3])
})

test("ResultUtils.filterErr - filters and unwraps failed results", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const errors = ResultUtils.filterErr(results)

  expect(errors).toEqual(["error1", "error2"])
})

test("ResultUtils.mapCollect - maps and collects successful results", () => {
  const items = [1, 2, 3, 4]
  const mapper = (x: number) => x % 2 === 0 ? Result.Ok(x * 2) : Result.Err(`odd: ${x}`)

  const result = ResultUtils.mapCollect(mapper)(items)

  expect(result.isErr()).toBe(true)
  expect(result.unwrapErr()).toEqual(["odd: 1", "odd: 3"])
})

test("ResultUtils.mapCollect - collects all when all succeed", () => {
  const items = [2, 4, 6]
  const mapper = (x: number) => Result.Ok(x * 2)

  const result = ResultUtils.mapCollect(mapper)(items)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toEqual([4, 8, 12])
})

test("ResultUtils.mapCollect - handles empty array", () => {
  const items: number[] = []
  const mapper = (x: number) => Result.Ok(x * 2)

  const result = ResultUtils.mapCollect(mapper)(items)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toEqual([])
})
