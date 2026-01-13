import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@domain/utils/base.errors'
import type { GroceryListType } from './grocery-list.entity'

type GroceryListId = GroceryListType['id']

export class GroceryListNotFoundError extends NotFoundError {
  override readonly code = 'GROCERY_LIST_NOT_FOUND' as const

  constructor(
    readonly listId: GroceryListId,
    context?: Record<string, unknown>,
  ) {
    super('GroceryList', String(listId), context)
  }
}

export class GroceryListValidationError extends ValidationError {
  override readonly code = 'GROCERY_LIST_VALIDATION_ERROR' as const
}

export class GroceryListOwnershipError extends ForbiddenError {
  override readonly code = 'GROCERY_LIST_OWNERSHIP_ERROR' as const

  constructor(
    readonly listId: GroceryListId,
    context?: Record<string, unknown>,
  ) {
    super('You are not the owner of this grocery list', 'list:owner', context)
  }
}
