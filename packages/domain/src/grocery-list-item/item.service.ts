import type { Result } from '@carbonteq/fp'
import type { GroceryListEntity } from '@domain/grocery-list/grocery-list.entity'
import type { UserEntity } from '@domain/user/user.entity'
import { FpUtils, ValidationError } from '@domain/utils'
import { ItemEntity, type ItemUpdateData } from './item.entity'
import type { ItemListMismatchError, ItemOwnershipError } from './item.errors'

function _sortItemsForDisplay(items: ItemEntity[]): ItemEntity[] {
  return items.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1
    }

    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}

export class ItemsDomainService {
  static updateItem(
    list: GroceryListEntity,
    item: ItemEntity,
    updateData: ItemUpdateData,
    user: UserEntity,
  ): Result<
    ItemEntity,
    ItemListMismatchError | ItemOwnershipError | ValidationError
  > {
    return item
      .ensureBelongsToList(list)
      .flatMap((_) => item.ensureCanBeModifiedBy(list, user))
      .map(FpUtils.serialized)
      .map((serialized) => ({
        ...serialized,
        ...updateData,
        // No need for an additional serialize step for updateData, unless we have multiple
        // properties that require encoding
        notes: updateData.notes
          ? updateData.notes.safeUnwrap()
          : serialized.notes,
        updatedAt: new Date(),
      }))
      .flatMap(ItemEntity.fromEncoded)
  }
}
