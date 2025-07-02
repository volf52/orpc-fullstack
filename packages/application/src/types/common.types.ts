import { Result, type UNIT } from "@carbonteq/fp"
import { z } from "zod"

// Application Error Status
export enum AppErrStatus {
  NotFound = "NotFound",
  Unauthorized = "Unauthorized",
  InvalidData = "InvalidData",
  InvalidOperation = "InvalidOperation",
  AlreadyExists = "AlreadyExists",
  GuardViolation = "GuardViolation",
  Generic = "Generic",
}

// Application Error
export class AppError extends Error {
  private constructor(
    readonly status: AppErrStatus,
    message?: string,
  ) {
    let msg: string
    if (message) {
      msg = message
    } else {
      msg = `AppError<${status}>`
    }

    super(msg)
  }

  static NotFound = (msg?: string): AppError =>
    new AppError(AppErrStatus.NotFound, msg)

  static Unauthorized = (msg?: string): AppError =>
    new AppError(AppErrStatus.Unauthorized, msg)

  static InvalidData = (msg?: string): AppError =>
    new AppError(AppErrStatus.InvalidData, msg)

  static InvalidOperation = (msg?: string): AppError =>
    new AppError(AppErrStatus.InvalidOperation, msg)

  static AlreadyExists = (msg?: string): AppError =>
    new AppError(AppErrStatus.AlreadyExists, msg)

  static GuardViolation = (msg?: string): AppError =>
    new AppError(AppErrStatus.GuardViolation, msg)

  static Generic = (msg: string): AppError =>
    new AppError(AppErrStatus.Generic, msg)

  static fromErr = (e: Error): AppError => {
    if (e instanceof AppError) {
      return new AppError(e.status, e.message)
    }

    // Map common error types from domain layer
    if (e.name === "NotFoundError") {
      return AppError.NotFound(e.message)
    }

    if (e.name === "AlreadyExistsError") {
      return AppError.AlreadyExists(e.message)
    }

    if (e.name === "InvalidOperation") {
      return AppError.InvalidOperation(e.message)
    }

    if (e.name === "UnauthorizedOperation") {
      return AppError.Unauthorized(e.message)
    }

    if (e.name === "ValidationError") {
      return AppError.InvalidData(e.message)
    }

    return AppError.Generic(e.message)
  }
}

type InnerResult<T> = Result<T, AppError>

export type EmptyResult = typeof ApplicationResult.EMPTY

// ApplicationResult - wrapper around Result<T, AppError>
export class ApplicationResult<T> {
  readonly _isOk: boolean

  static readonly EMPTY: ApplicationResult<UNIT> = new ApplicationResult(
    Result.UNIT_RESULT,
  )

  private constructor(private readonly inner_result: InnerResult<T>) {
    this._isOk = inner_result.isOk()
  }

  isOk(): this is ApplicationResult<T> {
    return this.inner_result.isOk()
  }

  isErr(): this is ApplicationResult<never> {
    return this.inner_result.isErr()
  }

  static Ok<T>(val: T): ApplicationResult<T> {
    return new ApplicationResult(Result.Ok(val))
  }

  static Err(err: Error): ApplicationResult<never> {
    const e = AppError.fromErr(err)
    return new ApplicationResult<never>(Result.Err(e))
  }

  static fromResult<T, E extends Error>(
    result: Result<T, E>,
  ): ApplicationResult<T> {
    const r = result.mapErr((e) => AppError.fromErr(e))
    return new ApplicationResult(r)
  }

  toResult(): Result<T, AppError> {
    return this.inner_result
  }

  flatMap<U>(f: (r: T) => Result<U, AppError>): ApplicationResult<U> {
    return new ApplicationResult(this.inner_result.flatMap(f))
  }

  unwrap(): T {
    return this.inner_result.unwrap()
  }

  unwrapErr(): AppError {
    return this.inner_result.unwrapErr()
  }

  map<U>(fn: (val: T) => U): ApplicationResult<U> {
    const newResult = this.inner_result.map(fn)
    return new ApplicationResult(newResult)
  }

  mapErr(fn: (err: AppError) => AppError): ApplicationResult<T> {
    return new ApplicationResult(this.inner_result.mapErr(fn))
  }

  safeUnwrap(): T | null {
    return this.inner_result.safeUnwrap()
  }

  // Note: zip and flatZip methods may return Promises in some cases
  // For now, commenting out to avoid type issues
  // zip<U>(fn: (r: T) => U): ApplicationResult<[T, U]> {
  //   return new ApplicationResult(this.inner_result.zip(fn))
  // }

  // flatZip<U>(f: (r: T) => Result<U, AppError>): ApplicationResult<[T, U]> {
  //   return new ApplicationResult(this.inner_result.flatZip(f))
  // }
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// Command and Query base interfaces
export interface Command {
  readonly type: string
}

export interface Query {
  readonly type: string
}

// Application service base interface
export interface ApplicationService {
  readonly serviceName: string
}

// Use case base interface
export interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<ApplicationResult<TResponse>>
}

// Validation schemas for common types
export const PaginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export type ValidatedPaginationParams = z.infer<typeof PaginationParamsSchema>
