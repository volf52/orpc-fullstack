import {
  GroceryListCreateSchema,
  GroceryListSchema,
} from '@domain/grocery-list/grocery-list.entity'
import {
  ItemCreateSchema,
  ItemSchema,
} from '@domain/grocery-list-item/item.entity'
import { UserSchema } from '@domain/user/user.entity'
import {
  PaginatedResultSchema,
  PaginationParamsSchema,
} from '@domain/utils/pagination.utils'
import { z } from 'zod/v4'

const list = GroceryListSchema.omit({ ownerId: true })

export type GroceryListListEncoded = z.input<typeof list>

export const NewGroceryListSchema = GroceryListCreateSchema.extend({
  items: z.array(ItemCreateSchema),
})
export type NewGroceryListData = z.output<typeof NewGroceryListSchema>
export type NewGroceryListEncoded = z.input<typeof NewGroceryListSchema>

export const GroceryListFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sinceMs: z.number().int().positive().optional(),
})

export const GetListsParamsSchema = z.object({
  filters: GroceryListFiltersSchema,
  pagination: PaginationParamsSchema,
})

export const GetListsResultSchema = PaginatedResultSchema(list)

export const GroceryListDetailsSchema = list.extend({
  owner: UserSchema,
  items: z.array(ItemSchema),
  stats: z.object({
    totalItems: z.number(),
    pendingItems: z.number(),
    completedItems: z.number(),
    completionPercentage: z.number(),
  }),
})
export type GroceryListDetails = z.input<typeof GroceryListDetailsSchema>

export type GetListsParams = z.input<typeof GetListsParamsSchema>
export type GetListsResult = z.input<typeof GetListsResultSchema>
