import {
  CreateGroceryListDto,
  UpdateGroceryListDto,
} from "@application/dtos/grocery-list.dto"
import { DashboardStatsSchema } from "@application/schemas/dashboard"
import {
  dtoStandardSchema,
  zodStandardSchemaV1,
} from "@application/utils/validation.utils"
import { appAuthenticatedBase } from "@contract/utils/oc.base"
import { GroceryListId } from "@domain/grocery-list/grocery-list.entity"
import {
  GetListsParamsSchema,
  GetListsResultSchema,
  GroceryListDetailsSchema,
} from "@domain/grocery-list/grocery-list.schemas"
import { type } from "@orpc/contract"
import { z } from "zod/v4"

const groceryListBase = appAuthenticatedBase

const groceryListIdStruct = z.object({
  id: GroceryListId,
})

export const getStats = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/stats",
    summary: "Get grocery list statistics for dashboard",
    tags: ["grocery-list"],
  })
  .input(type<void>())
  .output(zodStandardSchemaV1(DashboardStatsSchema))

export const getLists = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list",
    summary: "Get grocery lists with optional filters and pagination",
    tags: ["grocery-list"],
  })
  .input(zodStandardSchemaV1(GetListsParamsSchema))
  .output(zodStandardSchemaV1(GetListsResultSchema))

export const fetchRecentLists = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/recent",
    summary: "Get recent grocery lists",
    tags: ["grocery-list"],
  })
  .input(type<void>())
  .output(zodStandardSchemaV1(GetListsResultSchema))

export const getListById = groceryListBase
  .route({
    method: "GET",
    path: "/grocery-list/:id",
    summary: "Get a grocery list by ID",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(
    zodStandardSchemaV1(
      z.object({
        params: groceryListIdStruct,
      }),
    ),
  )
  .output(zodStandardSchemaV1(GroceryListDetailsSchema))

export const createGroceryList = groceryListBase
  .route({
    method: "POST",
    path: "/grocery-list",
    summary: "Create a new grocery list",
    tags: ["grocery-list"],
  })
  .input(dtoStandardSchema(CreateGroceryListDto))
  .output(zodStandardSchemaV1(GroceryListDetailsSchema))

export const updateGroceryList = groceryListBase
  .route({
    method: "PATCH",
    path: "/grocery-list/:id",
    summary: "Update a grocery list",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(dtoStandardSchema(UpdateGroceryListDto))
  // .input(S.standardSchemaV1(GroceryListCreateSchema))
  .output(zodStandardSchemaV1(GroceryListDetailsSchema))

export const deleteGroceryList = groceryListBase
  .route({
    method: "DELETE",
    path: "/grocery-list/:id",
    summary: "Delete a grocery list",
    tags: ["grocery-list"],
    inputStructure: "detailed",
  })
  .input(
    zodStandardSchemaV1(
      z.object({
        params: groceryListIdStruct,
      }),
    ),
  )
  .output(zodStandardSchemaV1(groceryListIdStruct))

export default {
  getStats,
  getLists,
  fetchRecentLists,
  getListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
}
