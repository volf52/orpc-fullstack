import { simpleSchemaDto } from "@application/utils/validation.utils"
import {
  GroceryListSchema,
  GroceryListUpdateSchema,
} from "@domain/grocery-list/grocery-list.entity"
import { NewGroceryListSchema } from "@domain/grocery-list/grocery-list.schemas"
import { z } from "zod/v4"

export class CreateGroceryListDto extends simpleSchemaDto(
  "CreateGroceryListDto",
  NewGroceryListSchema,
) {}

const UpdateGroceryListDtoSchema = z.object({
  params: z.object({
    id: GroceryListSchema.id,
  }),
  body: GroceryListUpdateSchema,
})

export class UpdateGroceryListDto extends simpleSchemaDto(
  "UpdateGroceryListDto",
  UpdateGroceryListDtoSchema,
) {}
