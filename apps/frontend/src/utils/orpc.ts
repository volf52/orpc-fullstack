"use client"

import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createORPCReactQueryUtils } from "@orpc/react-query"
import type { RouterUtils } from "@orpc/react-query"
import { QueryCache, QueryClient } from "@tanstack/react-query"
import { createContext, use } from "react"
import type { CONTRACT } from "@repo/contract/contracts"
import type { ContractRouterClient } from "@orpc/contract"
import { toaster } from "./toast"

type ContractClient = ContractRouterClient<typeof CONTRACT>
type ORPCReactUtils = RouterUtils<ContractClient>

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

export const client: ContractClient = createORPCClient(rpcLink)

export const orpc = createORPCReactQueryUtils(client)

export const ORPCCOntext = createContext<ORPCReactUtils | undefined>(undefined)

export const useORPC = (): ORPCReactUtils => {
  const orpc = use(ORPCCOntext)

  if (!orpc) {
    throw new Error("ORPC context is not provided")
  }

  return orpc
}
