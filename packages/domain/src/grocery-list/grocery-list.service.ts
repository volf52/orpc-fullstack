import { Result } from '@carbonteq/fp'
import { ItemEntity } from '@domain/grocery-list-item/item.entity'
import { type UserEntity } from '@domain/user/user.entity'
import type { ValidationError } from '@domain/utils'
import { ComposeUtils } from '@domain/utils/compose.utils'
import { FpUtils } from '@domain/utils/fp-utils'
import {
  GroceryListEntity,
  type GroceryListUpdateData,
} from './grocery-list.entity'
import type { GroceryListOwnershipError } from './grocery-list.errors'
import type {
  GroceryListDetails,
  NewGroceryListData,
} from './grocery-list.schemas'

type GroceryListStats = GroceryListDetails['stats']

export class GroceryListService {
  static calculateDetailedStats(items: ItemEntity[]): GroceryListStats {
    const totalItems = items.length
    const pendingItems = items.filter((item) => item.isPending()).length
    const completedItems = items.filter((item) => item.isBought()).length

    const completionPercentage =
      totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    return {
      totalItems,
      pendingItems,
      completedItems,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    }
  }

  private static serializeListData(
    list: GroceryListEntity,
    owner: UserEntity,
    items: ItemEntity[],
  ) {
    const itemsSerialized = items.map(FpUtils.serialized)

    return {
      ownerSerialized: owner.serialize(),
      listSerialized: list.serialize(),
      itemsSerialized,
    }
  }

  static processListDetails(
    list: GroceryListEntity,
    owner: UserEntity,
    items: ItemEntity[],
  ): Result<GroceryListDetails, GroceryListOwnershipError | ValidationError> {
    const r = list
      .ensureIsOwner(owner)
      .map((_) => GroceryListService.serializeListData(list, owner, items))
      .map(
        ({
          itemsSerialized,
          listSerialized,
          ownerSerialized,
        }): GroceryListDetails => {
          const stats = GroceryListService.calculateDetailedStats(items)

          return {
            ...listSerialized,
            items: itemsSerialized,
            owner: ownerSerialized,
            stats,
          }
        },
      )

    return r
  }

  static calculateCompletionStatus(
    items: ItemEntity[],
  ):
    | 'empty'
    | 'just-started'
    | 'in-progress'
    | 'nearly-complete'
    | 'completed' {
    if (items.length === 0) {
      return 'empty'
    }

    const completedItems = items.filter((item) => item.isBought()).length
    const completionRatio = completedItems / items.length

    if (completionRatio === 0) {
      return 'just-started'
    } else if (completionRatio === 1) {
      return 'completed'
    } else if (completionRatio >= 0.8) {
      return 'nearly-complete'
    } else {
      return 'in-progress'
    }
  }

  static createNewList(data: NewGroceryListData, owner: UserEntity) {
    const list = GroceryListEntity.create(data, owner)
    const items = data.items.map((itemData) =>
      ItemEntity.create(itemData, list, owner),
    )

    return { list, items }
  }

  static updateGroceryList(
    list: GroceryListEntity,
    updateData: GroceryListUpdateData,
    user: UserEntity,
  ): Result<GroceryListEntity, GroceryListOwnershipError | ValidationError> {
    return list
      .ensureIsOwner(user)
      .map(FpUtils.serialized)
      .map(ComposeUtils.merge({ ...updateData, updatedAt: new Date() }))
      .flatMap(GroceryListEntity.fromEncoded)
  }
}
