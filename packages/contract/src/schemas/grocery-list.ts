import { GroceryListSchema } from "@domain/entities/grocery-list.entity"
import { PaginationParamsSchema } from "@domain/utils/pagination.utils"
import { Schema as S } from "effect"

export const ListSummarySchema = GroceryListSchema.pipe(S.omit("ownerId"))
export const ListStatsSchema = S.Struct({
  totalLists: S.Number,
  recentListsCount: S.Number,
  activeItemsCount: S.optional(S.Number),
})
export const RecentListsParamsSchema = PaginationParamsSchema

export type ListSummary = S.Schema.Type<typeof ListSummarySchema>
export type ListStats = S.Schema.Type<typeof ListStatsSchema>
export type RecentListsParams = S.Schema.Type<typeof RecentListsParamsSchema>
