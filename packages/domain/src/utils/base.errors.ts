export abstract class AppError extends Error {
  abstract readonly code: string
  readonly timestamp: Date
  readonly context?: Record<string, unknown>

  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(message, { cause })
    this.name = this.constructor.name
    this.timestamp = new Date()
    this.context = context
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
    }
  }
}

export interface ValidationIssue {
  field?: string
  value?: unknown
  message: string
  path?: string[]
  cause?: unknown
}

export class ValidationError extends AppError {
  readonly code: string = 'VALIDATION_ERROR'
  readonly issues: ValidationIssue[]

  constructor(
    message: string,
    issues: ValidationIssue[] = [],
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(message, context, cause)
    this.issues = issues
    if (!cause) {
      this.cause = issues?.[0]?.cause
    }
  }

  get field(): string | undefined {
    return this.issues[0]?.field
  }

  get value(): unknown {
    return this.issues[0]?.value
  }

  static single(
    message: string,
    field?: string,
    value?: unknown,
    context?: Record<string, unknown>,
    cause?: unknown,
  ): ValidationError {
    const issues: ValidationIssue[] = field ? [{ field, value, message }] : []
    return new ValidationError(message, issues, context, cause)
  }

  static multiple(
    issues: ValidationIssue[],
    context?: Record<string, unknown>,
  ): ValidationError {
    const message = `Validation failed with ${issues.length} error(s): ${issues.map((i) => i.message).join(', ')}`
    return new ValidationError(message, issues, context)
  }
}

export class NotFoundError extends AppError {
  readonly code: string = 'NOT_FOUND'
  readonly resourceType: string
  readonly resourceId: string

  constructor(
    resourceType: string,
    resourceId: string,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(`${resourceType} with id '${resourceId}' not found`, context, cause)
    this.resourceType = resourceType
    this.resourceId = resourceId
  }
}

export class UnauthorizedError extends AppError {
  readonly code: string = 'UNAUTHORIZED'

  constructor(
    message = 'Authentication required',
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(message, context, cause)
  }
}

export class ForbiddenError extends AppError {
  readonly code: string = 'FORBIDDEN'
  readonly requiredPermission?: string

  constructor(
    message = 'Insufficient permissions',
    requiredPermission?: string,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(message, context, cause)
    this.requiredPermission = requiredPermission
  }
}

export class ConflictError extends AppError {
  readonly code: string = 'CONFLICT'
  readonly conflictReason: string

  constructor(
    conflictReason: string,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(`Conflict: ${conflictReason}`, context, cause)
    this.conflictReason = conflictReason
  }
}

export class InternalError extends AppError {
  readonly code: string = 'INTERNAL_ERROR'
  readonly originalError?: Error

  constructor(
    message = 'Internal server error',
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message, context, originalError)
    this.originalError = originalError
  }
}

export class ExternalServiceError extends AppError {
  readonly code: string = 'EXTERNAL_SERVICE_ERROR'
  readonly serviceName: string
  readonly serviceError?: unknown

  constructor(
    serviceName: string,
    message?: string,
    serviceError?: unknown,
    context?: Record<string, unknown>,
  ) {
    super(
      message || `External service '${serviceName}' error`,
      context,
      serviceError,
    )
    this.serviceName = serviceName
    this.serviceError = serviceError
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError
}

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError
}

export const isUnauthorizedError = (
  error: unknown,
): error is UnauthorizedError => {
  return error instanceof UnauthorizedError
}

export const isForbiddenError = (error: unknown): error is ForbiddenError => {
  return error instanceof ForbiddenError
}

export const isConflictError = (error: unknown): error is ConflictError => {
  return error instanceof ConflictError
}

export const isInternalError = (error: unknown): error is InternalError => {
  return error instanceof InternalError
}

export const isExternalServiceError = (
  error: unknown,
): error is ExternalServiceError => {
  return error instanceof ExternalServiceError
}
