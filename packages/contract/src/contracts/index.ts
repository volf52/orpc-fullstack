import type { ContractRouterClient } from "@orpc/contract"
import { whoami } from "./user"

export const CONTRACT = {
  authenticated: {
    auth: { whoami },
  },
}

export type AppRouterClient = ContractRouterClient<typeof CONTRACT>
