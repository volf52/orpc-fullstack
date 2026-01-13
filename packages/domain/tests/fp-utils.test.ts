import { expect, test } from "bun:test"
import { Result } from "@carbonteq/fp/result"
import { ValidationError } from "@domain/utils/base.errors"
import { FpUtils } from "@domain/utils/fp-utils"
import type { Paginated } from "@domain/utils/pagination.utils"
import { zodErrorToValidationError } from "@domain/utils/zod/error-mapper"
import { z } from "zod/v4"

// Tests for serialized utility

test("serialized - calls serialize method on object", () => {
  const obj = {
    serialize: () => ({ id: "123", name: "test" }),
  }

  const result = FpUtils.serialized(obj)

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
  const result = FpUtils.serialized(entity)

  expect(result).toEqual({
    id: "test",
    value: 42,
    timestamp: "2024-01-01T00:00:00Z",
  })
})

test("ResultUtils.pick - picks specified keys from Ok result", () => {
  const result = Result.Ok({
    name: "John",
    email: "john@example.com",
    age: 30,
    city: "NYC",
  })

  const picked = result.map(FpUtils.pick("name", "email"))

  expect(picked.isOk()).toBe(true)
  expect(picked.unwrap()).toEqual({ name: "John", email: "john@example.com" })
})

test("ResultUtils.pick - preserves Err result", () => {
  const result = Result.Err<string, { name: string; age: number }>("error")

  const picked = result.map(FpUtils.pick("name"))

  expect(picked.isErr()).toBe(true)
  expect(picked.unwrapErr()).toBe("error")
})

test("ResultUtils.pick - handles missing keys gracefully", () => {
  const result = Result.Ok({ name: "John", age: 30 })

  const picked = result.map(FpUtils.pick("name"))

  expect(picked.isOk()).toBe(true)
  expect(picked.unwrap()).toEqual({ name: "John" })
})

test("ResultUtils.extract - extracts single key from Ok result", () => {
  const result = Result.Ok({ name: "John", age: 30 })

  const extracted = result.map(FpUtils.extract("name"))

  expect(extracted.isOk()).toBe(true)
  expect(extracted.unwrap()).toBe("John")
})

test("ResultUtils.extract - preserves Err result", () => {
  const result = Result.Err<string, { name: string }>("error")

  const extracted = result.map(FpUtils.extract("name"))

  expect(extracted.isErr()).toBe(true)
  expect(extracted.unwrapErr()).toBe("error")
})

test("ResultUtils.extract - returns undefined for missing key", () => {
  const result = Result.Ok({ name: "John" })
  const extracted = result
    .map(
      // @ts-expect-error Testing missing key
      FpUtils.extract("age"),
    )
    .unwrap()

  expect(extracted).toBeUndefined()
})

test("ResultUtils.filterOk - filters and unwraps successful results", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const successes = FpUtils.filterOk(results)

  expect(successes).toEqual([1, 3])
})

test("ResultUtils.filterErr - filters and unwraps failed results", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const errors = FpUtils.filterErr(results)

  expect(errors).toEqual(["error1", "error2"])
})

// Tests for serializedPreserveId

test("ResultUtils.serializedPreserveId - preserves id from object and merges with serialized data", () => {
  const mockParseResult = Result.Ok({ name: "Test", value: 42 })
  const obj = {
    id: "test-id-123",
    serialize: () => mockParseResult,
  }

  const result = FpUtils.serializedPreserveId(obj)

  expect(result.isOk()).toBe(true)
  expect(result.unwrap()).toEqual({
    id: "test-id-123",
    name: "Test",
    value: 42,
  })
})

test("ResultUtils.serializedPreserveId - preserves Err from serialize method", () => {
  const failingResult = z.number().safeParse("not-a-number")

  expect(failingResult.success).toBe(false)

  if (!failingResult.success) {
    const mockParseResult = Result.Err(
      zodErrorToValidationError(failingResult.error),
    )
    const obj = {
      id: "test-id-123",
      serialize: () => mockParseResult,
    }

    const result = FpUtils.serializedPreserveId(obj)

    expect(result.isErr()).toBe(true)
  }
})

test("ResultUtils.collectSuccessful - returns Ok with all values when all results are successful", () => {
  const results = [Result.Ok(1), Result.Ok(2), Result.Ok(3)]

  const collected = FpUtils.collectSuccessful(results)

  expect(collected.isOk()).toBe(true)
  expect(collected.unwrap()).toEqual([1, 2, 3])
})

test("ResultUtils.collectSuccessful - returns Err with all errors when any result fails", () => {
  const results = [
    Result.Ok(1),
    Result.Err("error1"),
    Result.Ok(3),
    Result.Err("error2"),
  ]

  const collected = FpUtils.collectSuccessful(results)

  expect(collected.isErr()).toBe(true)
  expect(collected.unwrapErr()).toEqual(["error1", "error2"])
})

test("ResultUtils.collectSuccessful - handles empty array", () => {
  const results: Result<number, string>[] = []

  const collected = FpUtils.collectSuccessful(results)

  expect(collected.isOk()).toBe(true)
  expect(collected.unwrap()).toEqual([])
})

// Tests for log

test("ResultUtils.log - logs success result", () => {
  const originalLog = console.log
  const logs: unknown[] = []
  console.log = (...args) => logs.push(args)

  const result = Result.Ok("success value")
  FpUtils.log(result, "TEST")

  expect(logs).toHaveLength(1)
  expect(logs[0]).toEqual(["TEST Success:", "success value"])

  console.log = originalLog
})

test("ResultUtils.log - logs error result", () => {
  const originalError = console.error
  const errors: unknown[] = []
  console.error = (...args) => errors.push(args)

  const result = Result.Err("error value")
  FpUtils.log(result, "TEST")

  expect(errors).toHaveLength(1)
  expect(errors[0]).toEqual(["TEST Error:", "error value"])

  console.error = originalError
})

test("ResultUtils.log - works without prefix", () => {
  const originalLog = console.log
  const logs: unknown[] = []
  console.log = (...args) => logs.push(args)

  const result = Result.Ok("success")
  FpUtils.log(result)

  expect(logs).toHaveLength(1)
  expect(logs[0]).toEqual([" Success:", "success"])

  console.log = originalLog
})

// Tests for mapParseErrors

test("ResultUtils.mapParseErrors - converts successful results to ValidationError Result", () => {
  const results = [
    Result.Ok("value1"),
    Result.Ok("value2"),
    Result.Ok("value3"),
  ]

  const mapped = FpUtils.mapParseErrors(results)

  expect(mapped.isOk()).toBe(true)
  expect(mapped.unwrap()).toEqual(["value1", "value2", "value3"])
})

test("ResultUtils.mapParseErrors - converts ValidationErrors", () => {
  const results = [
    Result.Ok("value1"),
    Result.Err(ValidationError.single("Invalid value", "value2")),
    Result.Ok("value3"),
  ]

  const mapped = FpUtils.mapParseErrors(results)

  expect(mapped.isErr()).toBe(true)
  expect(mapped.unwrapErr()).toBeInstanceOf(ValidationError)
})

// Tests for paginatedSerialize

test("ResultUtils.paginatedSerialize - serializes paginated result with successful items", () => {
  const mockItems = [
    { serialize: () => Result.Ok({ id: 1, name: "Item 1" }) },
    { serialize: () => Result.Ok({ id: 2, name: "Item 2" }) },
  ]

  const paginatedData: Paginated<(typeof mockItems)[0]> = {
    items: mockItems,
    totalCount: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  }

  const result = FpUtils.paginatedSerialize(paginatedData)

  expect(result.isOk()).toBe(true)
  const serialized = result.unwrap()
  expect(serialized.items).toEqual([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ])
  expect(serialized.totalCount).toBe(2)
  expect(serialized.page).toBe(1)
})

test("ResultUtils.paginatedSerialize - handles ParseErrors in items", () => {
  const failingResult = z.string().safeParse(123)

  expect(failingResult.success).toBe(false)

  if (!failingResult.success) {
    const mockItems = [
      { serialize: () => Result.Ok({ id: 1, name: "Item 1" }) },
      {
        serialize: () =>
          Result.Err(zodErrorToValidationError(failingResult.error)),
      },
    ]

    const paginatedData: Paginated<(typeof mockItems)[0]> = {
      items: mockItems,
      totalCount: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    }

    const result = FpUtils.paginatedSerialize(paginatedData)

    expect(result.isErr()).toBe(true)
    expect(result.unwrapErr()).toBeInstanceOf(ValidationError)
  }
})
