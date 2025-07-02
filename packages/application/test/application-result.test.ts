import { describe, it, expect } from "bun:test"
import { Result } from "@carbonteq/fp"
import {
  AppError,
  AppErrStatus,
  ApplicationResult,
} from "../src/types/common.types"

describe("ApplicationResult", () => {
  describe("static constructors", () => {
    it("should create Ok result", () => {
      const result = ApplicationResult.Ok("success")

      expect(result.isOk()).toBe(true)
      expect(result.isErr()).toBe(false)
      expect(result.unwrap()).toBe("success")
      expect(result.safeUnwrap()).toBe("success")
    })

    it("should create Err result", () => {
      const error = new Error("test error")
      const result = ApplicationResult.Err(error)

      expect(result.isOk()).toBe(false)
      expect(result.isErr()).toBe(true)
      expect(result.safeUnwrap()).toBe(null)
      expect(result.unwrapErr()).toBeInstanceOf(AppError)
      expect(result.unwrapErr().status).toBe(AppErrStatus.Generic)
    })

    it("should create result from Result type", () => {
      const okResult = ApplicationResult.fromResult(Result.Ok("test"))
      const errResult = ApplicationResult.fromResult(
        Result.Err(new Error("fail")),
      )

      expect(okResult.isOk()).toBe(true)
      expect(okResult.unwrap()).toBe("test")

      expect(errResult.isErr()).toBe(true)
      expect(errResult.unwrapErr()).toBeInstanceOf(AppError)
    })
  })

  describe("transformations", () => {
    it("should map Ok values", () => {
      const result = ApplicationResult.Ok(5)
        .map((x) => x * 2)
        .map((x) => x.toString())

      expect(result.isOk()).toBe(true)
      expect(result.unwrap()).toBe("10")
    })

    it("should not transform Err values", () => {
      const result = ApplicationResult.Err(new Error("test")).map((x) => x * 2)

      expect(result.isErr()).toBe(true)
      expect(result.unwrapErr().message).toBe("test")
    })

    it("should flatMap correctly", () => {
      const result = ApplicationResult.Ok(5).flatMap((x) => Result.Ok(x * 2))

      expect(result.isOk()).toBe(true)
      expect(result.unwrap()).toBe(10)
    })

    it("should handle flatMap errors", () => {
      const result = ApplicationResult.Ok(5).flatMap((_x) =>
        Result.Err(AppError.InvalidData("invalid")),
      )

      expect(result.isErr()).toBe(true)
      expect(result.unwrapErr().status).toBe(AppErrStatus.InvalidData)
    })
  })

  describe("AppError", () => {
    it("should create different error types", () => {
      expect(AppError.NotFound().status).toBe(AppErrStatus.NotFound)
      expect(AppError.InvalidData().status).toBe(AppErrStatus.InvalidData)
      expect(AppError.Unauthorized().status).toBe(AppErrStatus.Unauthorized)
      expect(AppError.AlreadyExists().status).toBe(AppErrStatus.AlreadyExists)
      expect(AppError.InvalidOperation().status).toBe(
        AppErrStatus.InvalidOperation,
      )
      expect(AppError.GuardViolation().status).toBe(AppErrStatus.GuardViolation)
      expect(AppError.Generic("test").status).toBe(AppErrStatus.Generic)
    })

    it("should map different error types", () => {
      const notFoundError = new Error("not found")
      notFoundError.name = "NotFoundError"

      const appError = AppError.fromErr(notFoundError)
      expect(appError.status).toBe(AppErrStatus.NotFound)
    })
  })
})
