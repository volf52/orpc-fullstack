import type { Result, UnitResult } from "@carbonteq/fp"
import type { GroceryListNotFoundError } from "@domain/errors/grocery-list.errors"
import type {
  GroceryListEntity,
  GroceryListType,
  GroceryListUpdateData,
} from "../entities/grocery-list.entity"
import type { UserType } from "../entities/user.entity"

export abstract class GroceryListRepository {
  abstract create(
    list: GroceryListEntity,
  ): Promise<Result<GroceryListEntity, Error>>
  abstract findById(
    id: GroceryListType["id"],
  ): Promise<Result<GroceryListEntity, GroceryListNotFoundError>>
  abstract update(
    id: GroceryListType["id"],
    updates: GroceryListUpdateData,
  ): Promise<void>
  abstract delete(
    id: GroceryListType["id"],
  ): Promise<UnitResult<GroceryListNotFoundError>>
  abstract findByUserId(userId: UserType["id"]): Promise<GroceryListEntity[]>
}
