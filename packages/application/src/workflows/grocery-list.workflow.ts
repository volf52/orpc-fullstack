import type { CreateGroceryListDto } from "@application/dtos/grocery-list.dto"
import { GroceryListAppService } from "@application/services/grocery-list.app-service"
import { ApplicationResult } from "@application/utils/application-result.utils"
import type {
  GroceryListEncoded,
  GroceryListRepository,
  ItemRepository,
  UserEntity,
  UserRepository,
} from "@repo/domain"

export interface DashboardStats {
  totalLists: number
  recentLists: GroceryListEncoded[]
}

export class GroceryListWorkflow {
  private readonly groceryListService: GroceryListAppService

  constructor(
    private readonly groceryListRepo: GroceryListRepository,
    private readonly userRepo: UserRepository,
    private readonly itemRepo: ItemRepository,
  ) {
    this.groceryListService = new GroceryListAppService(groceryListRepo)
  }

  async createGroceryList(
    _dto: CreateGroceryListDto,
  ): Promise<ApplicationResult<GroceryListEncoded>> {
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async listGroceryListsForUser(user: UserEntity) {
    const result = await this.groceryListService.findGroceryListsForUser(user)
    return ApplicationResult.fromResult(result)
  }

  async getDashboardData(
    user: UserEntity,
  ): Promise<ApplicationResult<DashboardStats>> {
    const listsResult =
      await this.groceryListService.findGroceryListsForUser(user)

    if (listsResult.isErr()) {
      return ApplicationResult.fromResult(listsResult)
    }

    const { lists } = listsResult.unwrap()

    // Sort by updatedAt and get recent lists (HTTP layer orchestration)
    const recentLists = lists
      .sort((a, b) => {
        const aTime = a.updatedAt.toString()
        const bTime = b.updatedAt.toString()
        return bTime.localeCompare(aTime)
      })
      .slice(0, 4)

    const stats: DashboardStats = {
      totalLists: lists.length,
      recentLists,
    }

    return ApplicationResult.Ok(stats)
  }

  async updateGroceryList(
    _request: unknown, // UpdateGroceryListDto - not implemented yet
  ): Promise<ApplicationResult<unknown>> {
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async deleteGroceryList(_listId: string): Promise<ApplicationResult<void>> {
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }
}
