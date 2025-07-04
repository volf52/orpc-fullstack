import type { ContractRouterClient } from "@orpc/contract"
import groceryListContract from "./grocery-list"
import userContract from "./user"

export const CONTRACT = {
  authenticated: {
    user: userContract,
    groceryList: groceryListContract,
  },
}

export type AppRouterClient = ContractRouterClient<typeof CONTRACT>
