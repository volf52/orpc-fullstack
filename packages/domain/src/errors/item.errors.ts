import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/base.errors"

export class ItemNotFoundError extends NotFoundError {
  override readonly code = "ITEM_NOT_FOUND" as const

  constructor(itemId: string, context?: Record<string, unknown>) {
    super("Item", itemId, context)
  }
}

export class ItemValidationError extends ValidationError {
  override readonly code = "ITEM_VALIDATION_ERROR" as const
}

export class ItemOwnershipError extends ForbiddenError {
  override readonly code = "ITEM_OWNERSHIP_ERROR" as const
  readonly itemId: string

  constructor(itemId: string, context?: Record<string, unknown>) {
    super("You are not authorized to modify this item", "item:access", context)
    this.itemId = itemId
  }
}

export class ItemListMismatchError extends ValidationError {
  override readonly code = "ITEM_LIST_MISMATCH_ERROR" as const
  readonly itemId: string
  readonly listId: string

  constructor(
    itemId: string,
    listId: string,
    context?: Record<string, unknown>,
  ) {
    super(
      "Item does not belong to the specified list",
      [
        {
          field: "itemId",
          value: itemId,
          message: "Item does not belong to the specified list",
        },
      ],
      context,
    )
    this.itemId = itemId
    this.listId = listId
  }
}
