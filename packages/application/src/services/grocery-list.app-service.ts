import { parseErrorsToValidationError } from "@application/utils/validation-error.utils"
import { Result } from "@carbonteq/fp"
import {
  type GroceryListEncoded,
  type GroceryListRepository,
  ResultUtils,
  type UserEntity,
  type ValidationError,
} from "@repo/domain"

export class GroceryListAppService {
  constructor(private readonly groceryListRepo: GroceryListRepository) {}

  async findGroceryListsForUser(
    user: UserEntity,
  ): Promise<Result<{ lists: GroceryListEncoded[] }, ValidationError>> {
    const lists = await this.groceryListRepo.findByUserId(user.id)
    const listsEncoded = Result.all(...lists.map(ResultUtils.serialized))
      .mapErr(parseErrorsToValidationError)
      .map((lists) => ({ lists }))

    return listsEncoded
  }
}
