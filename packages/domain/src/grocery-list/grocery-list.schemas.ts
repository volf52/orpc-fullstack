import {
  GroceryListCreateSchema,
  GroceryListSchema,
} from "@domain/grocery-list/grocery-list.entity"
import {
  ItemCreateSchema,
  ItemSchema,
} from "@domain/grocery-list-item/item.entity"
import { UserSchema } from "@domain/user/user.entity"
import {
  PaginatedResultSchema,
  PaginationParamsSchema,
} from "@domain/utils/pagination.utils"
import { Schema as S } from "effect"

const list = GroceryListSchema.pipe(S.omit("ownerId"))
const encodedList = S.encodedBoundSchema(list)

export type GroceryListEncoded = S.Schema.Encoded<typeof list>

export const NewGroceryListSchema = GroceryListCreateSchema.pipe(
  S.extend(
    S.Struct({
      items: S.Array(ItemCreateSchema),
    }),
  ),
)
export type NewGroceryListData = S.Schema.Type<typeof NewGroceryListSchema>
export type NewGroceryListEncoded = S.Schema.Encoded<
  typeof NewGroceryListSchema
>

export const GroceryListFiltersSchema = S.Struct({
  search: S.optional(S.String),
  status: S.optional(S.Literal("active", "inactive")),
  sinceMs: S.optional(S.Number.pipe(S.int(), S.positive())),
})

export const GetListsParamsSchema = S.Struct({
  filters: GroceryListFiltersSchema,
  pagination: PaginationParamsSchema,
})

export const GetListsResultSchema = PaginatedResultSchema(S.encodedSchema(list))

export const GroceryListDetailsSchema = S.mutable(
  encodedList.pipe(
    S.extend(
      S.Struct({
        owner: S.encodedBoundSchema(UserSchema),
        items: S.Array(S.encodedBoundSchema(ItemSchema)),
        stats: S.Struct({
          totalItems: S.Number,
          pendingItems: S.Number,
          completedItems: S.Number,
          completionPercentage: S.Number,
        }),
      }),
    ),
  ),
)
export type GroceryListDetails = S.Schema.Encoded<
  typeof GroceryListDetailsSchema
>

export type GetListsParams = S.Schema.Encoded<typeof GetListsParamsSchema>
export type GetListsResult = S.Schema.Encoded<typeof GetListsResultSchema>
