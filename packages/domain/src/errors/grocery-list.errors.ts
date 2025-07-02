import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/base.errors"

export class GroceryListNotFoundError extends NotFoundError {
  override readonly code = "GROCERY_LIST_NOT_FOUND" as const

  constructor(listId: string, context?: Record<string, unknown>) {
    super("GroceryList", listId, context)
  }
}

export class GroceryListValidationError extends ValidationError {
  override readonly code = "GROCERY_LIST_VALIDATION_ERROR" as const
}

export class GroceryListOwnershipError extends ForbiddenError {
  override readonly code = "GROCERY_LIST_OWNERSHIP_ERROR" as const
  readonly listId: string

  constructor(listId: string, context?: Record<string, unknown>) {
    super("You are not the owner of this grocery list", "list:owner", context)
    this.listId = listId
  }
}

export class ItemNotFoundError extends NotFoundError {
  override readonly code = "ITEM_NOT_FOUND" as const

  constructor(itemId: string, context?: Record<string, unknown>) {
    super("Item", itemId, context)
  }
}

export class InvalidInviteError extends ValidationError {
  override readonly code = "INVALID_INVITE" as const

  constructor(reason: string, context?: Record<string, unknown>) {
    super(`Invalid invite: ${reason}`, "invite", undefined, context)
  }
}
