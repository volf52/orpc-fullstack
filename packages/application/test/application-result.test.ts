import { describe, expect, it } from "bun:test"
import { Result } from "@carbonteq/fp"
import {
  ConflictError,
  ExternalServiceError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@repo/domain"
import {
  AppError,
  AppErrStatus,
  ApplicationResult,
} from "../src/utils/application-result.utils"

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
      expect(AppError.Forbidden().status).toBe(AppErrStatus.Forbidden)
      expect(AppError.Conflict().status).toBe(AppErrStatus.Conflict)
      expect(AppError.InternalError().status).toBe(AppErrStatus.InternalError)
      expect(AppError.ExternalServiceError().status).toBe(
        AppErrStatus.ExternalServiceError,
      )
      expect(AppError.Generic("test").status).toBe(AppErrStatus.Generic)
    })

    it("should map different error types using instanceof checks", () => {
      // Test domain error mapping with actual domain error instances
      const notFoundError = new NotFoundError("TestResource", "123")
      expect(AppError.fromErr(notFoundError).status).toBe(AppErrStatus.NotFound)

      const unauthorizedError = new UnauthorizedError("unauthorized")
      expect(AppError.fromErr(unauthorizedError).status).toBe(
        AppErrStatus.Unauthorized,
      )

      const forbiddenError = new ForbiddenError("forbidden")
      expect(AppError.fromErr(forbiddenError).status).toBe(
        AppErrStatus.Forbidden,
      )

      const validationError = ValidationError.single(
        "validation failed",
        "field",
      )
      expect(AppError.fromErr(validationError).status).toBe(
        AppErrStatus.InvalidData,
      )

      const conflictError = new ConflictError("resource already exists")
      expect(AppError.fromErr(conflictError).status).toBe(AppErrStatus.Conflict)

      const internalError = new InternalError("internal error")
      expect(AppError.fromErr(internalError).status).toBe(
        AppErrStatus.InternalError,
      )

      const externalServiceError = new ExternalServiceError(
        "payment-service",
        "external service error",
      )
      expect(AppError.fromErr(externalServiceError).status).toBe(
        AppErrStatus.ExternalServiceError,
      )

      // Test unknown error type fallback
      const unknownError = new Error("unknown error")
      expect(AppError.fromErr(unknownError).status).toBe(AppErrStatus.Generic)
    })
  })
})
