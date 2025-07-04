import { appAuthenticatedBase } from "@contract/utils/oc.base"
// Import domain schemas directly for better type safety and reuse
import {
  GroceryListCreateSchema,
  GroceryListId,
  GroceryListUpdateSchema,
} from "@domain/entities/grocery-list.entity"
import { Schema as S } from "effect"
import {
  ListStatsSchema,
  ListSummarySchema,
  RecentListsParamsSchema,
} from "../schemas/grocery-list"

const groceryListBase = appAuthenticatedBase

export const getStats = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/stats",
    summary: "Get grocery list statistics for dashboard",
    tags: ["grocery-list"],
  })
  .input(S.standardSchemaV1(S.Void)) // No input required - using Effect Schema Void
  .output(S.standardSchemaV1(ListStatsSchema))

export const getRecentLists = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/recent",
    summary: "Get recent grocery lists for dashboard",
    tags: ["grocery-list"],
  })
  .input(S.standardSchemaV1(RecentListsParamsSchema))
  .output(S.standardSchemaV1(S.Array(ListSummarySchema)))

export const getListById = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/:id",
    summary: "Get a grocery list by ID",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(
    S.standardSchemaV1(
      S.Struct({
        params: S.Struct({
          id: GroceryListId,
        }),
      }),
    ),
  )
  .output(S.standardSchemaV1(ListSummarySchema))

// CREATE: Use domain create schema for request body validation
export const createGroceryList = groceryListBase
  .route({
    method: "POST",
    path: "/grocery-list",
    summary: "Create a new grocery list",
    tags: ["grocery-list"],
  })
  .input(S.standardSchemaV1(GroceryListCreateSchema)) // Reuse domain creation schema
  .output(S.standardSchemaV1(ListSummarySchema)) // Reuse domain summary schema

// UPDATE: Use domain update schema for request body validation
export const updateGroceryList = groceryListBase
  .route({
    method: "PATCH",
    path: "/grocery-list/:id",
    summary: "Update a grocery list",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(
    S.standardSchemaV1(
      S.Struct({
        params: S.Struct({
          id: GroceryListId, // Reuse domain ID schema
        }),
        body: GroceryListUpdateSchema, // Reuse domain update schema
      }),
    ),
  )
  .output(S.standardSchemaV1(ListSummarySchema))

// DELETE: Use domain ID schema for path parameter
export const deleteGroceryList = groceryListBase
  .route({
    method: "DELETE",
    path: "/grocery-list/:id",
    summary: "Delete a grocery list",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(
    S.standardSchemaV1(
      S.Struct({
        params: S.Struct({
          id: GroceryListId, // Reuse domain ID schema
        }),
      }),
    ),
  )
  .output(S.standardSchemaV1(S.Void)) // No response body for successful deletion

export const getGroceryListsWithFilters = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/filtered",
    summary: "Get filtered grocery lists",
    tags: ["grocery-list"],
  })
  .input(
    S.standardSchemaV1(
      S.Struct({
        search: S.optional(S.String),
        status: S.optional(S.Literal("active", "inactive")),
        pagination: RecentListsParamsSchema, // Reuse domain schema
      }),
    ),
  )
  .output(S.standardSchemaV1(S.Array(ListSummarySchema)))

export default {
  getStats,
  getRecentLists,
  getListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
}
