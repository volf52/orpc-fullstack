import type { CreateGroceryListDto } from "@application/dtos/grocery-list.dto"
import type {
  GroceryListEncoded,
  GroceryListRepository,
  ItemRepository,
  UserEntity,
  UserRepository,
} from "@repo/domain"
import { ApplicationResult } from "../types/common.types"

export class GroceryListWorkflow {
  constructor(
    private readonly groceryListRepo: GroceryListRepository,
    private readonly userRepo: UserRepository,
    private readonly itemRepo: ItemRepository,
  ) {}

  async createGroceryList(
    _dto: CreateGroceryListDto,
  ): Promise<ApplicationResult<GroceryListEncoded>> {
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async listGroceryListsForUser(user: UserEntity) {
    const lists = await this.groceryListRepo.findByUserId(user.id)

    const _listsEncoded = lists.map((list) => list.serialize)
  }

  async updateGroceryList(
    _request: unknown, // UpdateGroceryListDto - not implemented yet
  ): Promise<ApplicationResult<unknown>> {
    // GroceryListDto - not implemented yet
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async listUserGroceryLists(
    _request: unknown, // GroceryListQueryDto - not implemented yet
  ): Promise<ApplicationResult<unknown[]>> {
    // GroceryListDto[] - not implemented yet
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }

  async deleteGroceryList(_listId: string): Promise<ApplicationResult<void>> {
    // Implementation will be added later
    return ApplicationResult.Err(new Error("Not implemented yet"))
  }
}
