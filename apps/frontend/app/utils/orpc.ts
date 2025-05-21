import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { CONTRACT } from "@repo/contract/contracts"
import type { ContractRouterClient } from "@orpc/contract"

export type ContractClient = ContractRouterClient<typeof CONTRACT>

export const rpcLink = new RPCLink({
  url: `${import.meta.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  fetch(req, opts) {
    return fetch(req, {
      credentials: "include",
      ...opts,
    })
  },
})

export const orpcClient: ContractClient = createORPCClient(rpcLink)
