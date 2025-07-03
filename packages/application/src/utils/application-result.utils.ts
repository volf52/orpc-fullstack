import { Result, type UNIT } from "@carbonteq/fp"
import { ParseError } from "@effect/schema/ParseResult"

import {
  ConflictError,
  ExternalServiceError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@repo/domain"

export enum AppErrStatus {
  NotFound = "NotFound",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  InvalidData = "InvalidData",
  Conflict = "Conflict",
  InternalError = "InternalError",
  ExternalServiceError = "ExternalServiceError",
  Generic = "Generic",
}

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

  static Forbidden = (msg?: string): AppError =>
    new AppError(AppErrStatus.Forbidden, msg)

  static InvalidData = (msg?: string): AppError =>
    new AppError(AppErrStatus.InvalidData, msg)

  static Conflict = (msg?: string): AppError =>
    new AppError(AppErrStatus.Conflict, msg)

  static InternalError = (msg?: string): AppError =>
    new AppError(AppErrStatus.InternalError, msg)

  static ExternalServiceError = (msg?: string): AppError =>
    new AppError(AppErrStatus.ExternalServiceError, msg)

  static Generic = (msg: string): AppError =>
    new AppError(AppErrStatus.Generic, msg)

  static fromErr = (e: Error): AppError => {
    if (e instanceof AppError) {
      return new AppError(e.status, e.message)
    }

    if (e instanceof NotFoundError) {
      return AppError.NotFound(e.message)
    }

    if (e instanceof UnauthorizedError) {
      return AppError.Unauthorized(e.message)
    }

    if (e instanceof ForbiddenError) {
      return AppError.Forbidden(e.message)
    }

    if (e instanceof ValidationError || e instanceof ParseError) {
      return AppError.InvalidData(e.message)
    }

    if (e instanceof ConflictError) {
      return AppError.Conflict(e.message)
    }

    if (e instanceof InternalError) {
      return AppError.InternalError(e.message)
    }

    if (e instanceof ExternalServiceError) {
      return AppError.ExternalServiceError(e.message)
    }

    // Fallback for unknown errors
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
