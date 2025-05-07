import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { QueryCache, QueryClient } from "@tanstack/react-query"
import type { CONTRACT } from "@repo/contract/contracts"
import type { ContractRouterClient } from "@orpc/contract"
import { toaster } from "./toast"

export type ContractClient = ContractRouterClient<typeof CONTRACT>

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
        action: {
          label: "retry",
          onClick: () => queryClient.invalidateQueries(),
        },
      })
    },
  }),
})

export const rpcLink = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
  fetch(req, opts) {
    return fetch(req, {
      credentials: "include",
      ...opts,
    })
  },
})

export const orpcClient: ContractClient = createORPCClient(rpcLink)
