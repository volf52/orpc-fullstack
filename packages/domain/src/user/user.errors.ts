import { NotFoundError, ValidationError } from '@domain/utils/base.errors'
import type { UserType } from './user.entity'

// User not found error
export class UserNotFoundError extends NotFoundError {
  override readonly code = 'USER_NOT_FOUND' as const

  constructor(userId: UserType['id'], context?: Record<string, unknown>) {
    super('User', String(userId), context)
  }
}

export class UserValidationError extends ValidationError {
  override readonly code = 'USER_VALIDATION_ERROR' as const
}
