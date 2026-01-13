import type { GroceryListType } from '@domain/grocery-list/grocery-list.entity'
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@domain/utils/base.errors'
import type { ItemType } from './item.entity'

type ItemId = ItemType['id']

export class ItemNotFoundError extends NotFoundError {
  override readonly code = 'ITEM_NOT_FOUND' as const

  constructor(
    readonly itemId: ItemId,
    context?: Record<string, unknown>,
  ) {
    super('Item', String(itemId), context)
  }
}

export class ItemValidationError extends ValidationError {
  override readonly code = 'ITEM_VALIDATION_ERROR' as const
}

export class ItemOwnershipError extends ForbiddenError {
  override readonly code = 'ITEM_OWNERSHIP_ERROR' as const

  constructor(
    readonly itemId: ItemId,
    context?: Record<string, unknown>,
  ) {
    super('You are not authorized to modify this item', 'item:access', context)
  }
}

export class ItemListMismatchError extends ValidationError {
  override readonly code = 'ITEM_LIST_MISMATCH_ERROR' as const

  constructor(
    readonly itemId: ItemId,
    readonly listId: GroceryListType['id'],
    context?: Record<string, unknown>,
  ) {
    super(
      'Item does not belong to the specified list',
      [
        {
          field: 'itemId',
          value: itemId,
          message: 'Item does not belong to the specified list',
        },
      ],
      context,
    )
  }
}
