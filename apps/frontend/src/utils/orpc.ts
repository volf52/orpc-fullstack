import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { ContractRouterClient } from "@orpc/contract"
import { createORPCReactQueryUtils, type RouterUtils } from "@orpc/react-query"
import type { CONTRACT } from "@repo/contract/contracts"

export type ContractClient = ContractRouterClient<typeof CONTRACT>

export const rpcLink = new RPCLink({
  url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
  fetch(req, opts) {
    return fetch(req, {
      credentials: "include",
      ...opts,
    })
  },
})

export const orpcClient = createORPCClient<ContractClient>(rpcLink)

export type OrpcReactQuery = RouterUtils<ContractClient>
export const orpc = createORPCReactQueryUtils(orpcClient)
