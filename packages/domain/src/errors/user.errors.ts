import { NotFoundError, ValidationError } from "../utils/base.errors"

// User not found error
export class UserNotFoundError extends NotFoundError {
  override readonly code = "USER_NOT_FOUND" as const

  constructor(userId: string, context?: Record<string, unknown>) {
    super("User", userId, context)
  }
}

export class UserValidationError extends ValidationError {
  override readonly code = "USER_VALIDATION_ERROR" as const
}
