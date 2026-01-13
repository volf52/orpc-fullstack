import type { GroceryListType } from '@domain/grocery-list/grocery-list.entity'
import type {
  ItemEntity,
  ItemStatus,
  ItemType,
} from '@domain/grocery-list-item/item.entity'
import type { UserType } from '@domain/user/user.entity'
import type { RepoResult } from '@domain/utils'
import type { ItemNotFoundError } from './item.errors'

export type GroceryItemFilters = {
  userId?: UserType['id']
  listId?: GroceryListType['id']
  status?: ItemStatus
  updatedSince?: Date
}

export abstract class ItemRepository {
  abstract create(item: ItemEntity): Promise<RepoResult<ItemEntity>>

  abstract findByList(list: GroceryListType): Promise<RepoResult<ItemEntity[]>>

  abstract update(
    item: ItemEntity,
  ): Promise<RepoResult<ItemEntity, ItemNotFoundError>>

  abstract delete(
    id: ItemType['id'],
  ): Promise<RepoResult<ItemEntity, ItemNotFoundError>>

  abstract deleteByList(
    list: GroceryListType,
  ): Promise<RepoResult<ItemEntity['id'][]>>
  abstract count(filters: GroceryItemFilters): Promise<number>
}
