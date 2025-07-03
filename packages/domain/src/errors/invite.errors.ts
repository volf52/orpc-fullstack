import { NotFoundError, ValidationError } from "../utils/base.errors"

export class InviteNotFoundError extends NotFoundError {
  override readonly code = "INVITE_NOT_FOUND" as const

  constructor(inviteId: string, context?: Record<string, unknown>) {
    super("Invite", inviteId, context)
  }
}

export class InviteValidationError extends ValidationError {
  override readonly code = "INVITE_VALIDATION_ERROR" as const
}

export class InviteExpiredError extends ValidationError {
  override readonly code = "INVITE_EXPIRED" as const

  constructor(context?: Record<string, unknown>) {
    super("The invitation has expired", [], context)
  }
}

export class InviteAlreadyUsedError extends ValidationError {
  override readonly code = "INVITE_ALREADY_USED" as const

  constructor(context?: Record<string, unknown>) {
    super("The invitation has already been used", [], context)
  }
}

export class InvalidInviteTokenError extends ValidationError {
  override readonly code = "INVALID_INVITE_TOKEN" as const

  constructor(context?: Record<string, unknown>) {
    super("Invalid invite token", [], context)
  }
}
