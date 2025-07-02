import type { Result } from "@carbonteq/fp"
import type { ItemNotFoundError } from "@domain/errors/item.errors"
import type { GroceryListType } from "../entities/grocery-list.entity"
import type { ItemEntity, ItemStatus, ItemType } from "../entities/item.entity"
import type { UserType } from "../entities/user.entity"

export interface ItemUpdateData {
  name?: string
  quantity?: number
  status?: ItemStatus
}

export abstract class ItemRepository {
  abstract create(item: ItemEntity): Promise<Result<ItemEntity, Error>>

  abstract findById(
    id: ItemType["id"],
  ): Promise<Result<ItemEntity, ItemNotFoundError>>

  abstract findByListId(listId: GroceryListType["id"]): Promise<ItemEntity[]>

  abstract findByUserId(userId: UserType["id"]): Promise<ItemEntity[]>

  abstract findByListIdAndStatus(
    listId: GroceryListType["id"],
    status: ItemStatus,
  ): Promise<ItemEntity[]>

  abstract update(
    id: ItemType["id"],
    updates: ItemUpdateData,
  ): Promise<Result<ItemEntity, ItemNotFoundError>>

  abstract delete(id: ItemType["id"]): Promise<Result<void, ItemNotFoundError>>

  abstract deleteByListId(listId: GroceryListType["id"]): Promise<void>

  abstract countByListId(listId: GroceryListType["id"]): Promise<number>

  abstract countByListIdAndStatus(
    listId: GroceryListType["id"],
    status: ItemStatus,
  ): Promise<number>
}
