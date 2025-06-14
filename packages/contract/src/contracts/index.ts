import type { ContractRouterClient } from "@orpc/contract"
import userContract from "./user"

export const CONTRACT = {
  authenticated: {
    user: userContract,
  },
}

export type AppRouterClient = ContractRouterClient<typeof CONTRACT>
