import type { ItemEntity } from '@domain/grocery-list-item'
import type { UserType } from '@domain/user/user.entity'
import type { RepoResult, RepoUnitResult } from '@domain/utils'
import type {
  Paginated,
  PaginationParams,
} from '@domain/utils/pagination.utils'
import type { GroceryListEntity, GroceryListType } from './grocery-list.entity'
import type { GroceryListNotFoundError } from './grocery-list.errors'

export type GroceryListFindFilters = {
  userId?: UserType['id']
  search?: string
  status?: 'active' | 'inactive'
  since?: Date
}

export abstract class GroceryListRepository {
  abstract create(
    list: GroceryListEntity,
    items: ItemEntity[],
  ): Promise<RepoResult<GroceryListEntity, Error>>
  abstract findById(
    id: GroceryListType['id'],
  ): Promise<RepoResult<GroceryListEntity, GroceryListNotFoundError>>
  abstract update(
    list: GroceryListEntity,
  ): Promise<RepoResult<GroceryListEntity, GroceryListNotFoundError>>
  abstract delete(
    id: GroceryListType['id'],
  ): Promise<RepoUnitResult<GroceryListNotFoundError>>
  abstract findByUserId(
    userId: UserType['id'],
  ): Promise<RepoResult<GroceryListEntity[]>>
  abstract findWithFilters(
    filters: GroceryListFindFilters,
    pagination: PaginationParams,
  ): Promise<RepoResult<Paginated<GroceryListEntity>>>
  abstract count(filters: GroceryListFindFilters): Promise<number>
}
