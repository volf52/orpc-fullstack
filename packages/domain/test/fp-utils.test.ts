import { test, expect } from "bun:test"
import { Effect, Either } from "effect"
import { Result } from "@carbonteq/fp/result"
import {
  eitherToResult,
  resultToEither,
  effectToResult,
  effectToResultAsync,
  resultToEffect,
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
