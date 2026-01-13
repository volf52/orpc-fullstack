import {
  CreateGroceryListDto,
  UpdateGroceryListDto,
} from "@application/dtos/grocery-list.dto"
import type { DashboardStats } from "@application/schemas/dashboard"
import { ApplicationResult } from "@application/utils/application-result.utils"
import { Result } from "@carbonteq/fp"
import type { GroceryListType } from "@domain/grocery-list/grocery-list.entity"
import {
  type GroceryListFindFilters,
  GroceryListRepository,
} from "@domain/grocery-list/grocery-list.repository"
import type {
  GetListsParams,
  GetListsResult,
} from "@domain/grocery-list/grocery-list.schemas"
import { GroceryListService } from "@domain/grocery-list/grocery-list.service"
import { ItemRepository } from "@domain/grocery-list-item/item.repository"
import type { UserEntity } from "@domain/user/user.entity"
import type { PaginationParams } from "@domain/utils"
import { FpUtils } from "@domain/utils/fp-utils"
import { autoInjectable } from "tsyringe"

const sevenDaysAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)

  return date
}

@autoInjectable()
export class GroceryListWorkflows {
  constructor(
    private readonly groceryListRepo: GroceryListRepository,
    private readonly groceryItemsRepo: ItemRepository,
  ) {}

  async fetchGroceryListDetails(id: GroceryListType["id"], user: UserEntity) {
    const list = await this.groceryListRepo.findById(id)
    const listDetails = await list
      .flatZip((list) => this.groceryItemsRepo.findByList(list))
      .flatMap(([list, items]) =>
        GroceryListService.processListDetails(list, user, items),
      )
      .toPromise()

    return ApplicationResult.fromResult(listDetails)
  }

  async createGroceryList(dto: CreateGroceryListDto, user: UserEntity) {
    const { items, list } = GroceryListService.createNewList(dto.data, user)

    const listPersistResult = await this.groceryListRepo.create(list, items)

    const result = listPersistResult.flatMap((_) =>
      GroceryListService.processListDetails(list, user, items),
    )

    return ApplicationResult.fromResult(result)
  }

  async fetchGroceryListsForUser(user: UserEntity) {
    const lists = await this.groceryListRepo.findByUserId(user.id)
    const encoded = lists.flatMap((lists) => {
      const serialized = lists.map(FpUtils.serialized)

      return FpUtils.collectValidationErrors(serialized)
    })

    return ApplicationResult.fromResult(encoded)
  }

  private async fetchWithFilters(
    filters: GroceryListFindFilters,
    paginationParams: PaginationParams,
  ) {
    const lists = await this.groceryListRepo.findWithFilters(
      filters,
      paginationParams,
    )
    const encoded = lists.flatMap(FpUtils.paginatedSerialize)

    return ApplicationResult.fromResult(encoded)
  }

  async getGroceryListsWithFilters(
    user: UserEntity,
    { filters, pagination }: GetListsParams,
  ): Promise<ApplicationResult<GetListsResult>> {
    const since = filters.sinceMs
      ? new Date(Date.now() - filters.sinceMs)
      : undefined

    const repoFilters: GroceryListFindFilters = {
      userId: user.id,
      search: filters.search,
      status: filters.status,
      since,
    }

    return await this.fetchWithFilters(repoFilters, pagination)
  }

  async fetchRecentLists(user: UserEntity) {
    const since = sevenDaysAgo()
    return await this.fetchWithFilters(
      {
        userId: user.id,
        since,
      },
      {},
    )
  }

  async getDashboardStats(
    user: UserEntity,
  ): Promise<ApplicationResult<DashboardStats>> {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const recentSince = sevenDaysAgo()

    const [totalLists, recentLists, pendingItems, completedToday] =
      await Promise.all([
        this.groceryListRepo.count({ userId: user.id }),
        this.groceryListRepo.count({ userId: user.id, since: recentSince }),
        this.groceryItemsRepo.count({ userId: user.id, status: "pending" }),
        this.groceryItemsRepo.count({
          userId: user.id,
          status: "bought",
          updatedSince: startOfToday,
        }),
      ])

    const stats: DashboardStats = {
      totalLists,
      recentLists,
      pendingItems,
      completedToday,
    }

    return ApplicationResult.fromResult(Result.Ok(stats))
  }

  async updateGroceryList({ data }: UpdateGroceryListDto, user: UserEntity) {
    const list = await this.groceryListRepo.findById(data.params.id)

    const result = await list
      .flatMap((existingList) =>
        GroceryListService.updateGroceryList(existingList, data.body, user),
      )
      .flatMap(
        async (updatedList) => await this.groceryListRepo.update(updatedList),
      )
      .flatZip(async (list) => await this.groceryItemsRepo.findByList(list))
      .flatMap(([list, items]) =>
        GroceryListService.processListDetails(list, user, items),
      )
      .toPromise()

    return ApplicationResult.fromResult(result)
  }

  async deleteGroceryList(
    listId: GroceryListType["id"],
    user: UserEntity,
  ): Promise<ApplicationResult<{ id: GroceryListType["id"] }>> {
    const list = await this.groceryListRepo.findById(listId)
    const res = await list
      .flatMap((l) => l.ensureIsOwner(user))
      .flatMap(async (l) => this.groceryListRepo.delete(l.id))
      .map((_) => ({ id: listId }))
      .toPromise()

    return ApplicationResult.fromResult(res)
  }
}
