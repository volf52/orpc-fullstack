import { validateWithEffect } from "@application/utils/validation.utils"
import type { Result } from "@carbonteq/fp"
import {
  type GroceryListCreateData,
  GroceryListCreateSchema,
} from "@domain/entities/grocery-list.entity"
import type { ValidationError } from "@domain/utils/base.errors"

export class CreateGroceryListDto implements GroceryListCreateData {
  readonly name: string
  readonly description: string

  private constructor(data: GroceryListCreateData) {
    this.name = data.name
    this.description = data.description
  }

  static create(data: unknown): Result<CreateGroceryListDto, ValidationError> {
    return validateWithEffect(GroceryListCreateSchema, data).map(
      (validatedData) => new CreateGroceryListDto(validatedData),
    )
  }
}
