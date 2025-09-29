import { type ClientContext, createORPCClient } from "@orpc/client"
import { RPCLink, type RPCLinkOptions } from "@orpc/client/fetch"
import { createORPCReactQueryUtils, type RouterUtils } from "@orpc/react-query"
import type { AppRouterClient } from "@repo/contract/contracts"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders as getHeaders } from "@tanstack/react-start/server"

export type ContractClient = AppRouterClient

// https://orpc.unnoq.com/docs/adapters/tanstack-start
// https://orpc.unnoq.com/docs/integrations/tanstack-query

const baseRpcLinkOpts: RPCLinkOptions<ClientContext> = {
  url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
}

const getClientLink = createIsomorphicFn()
  .client(
    () =>
      new RPCLink({
        ...baseRpcLinkOpts,
        fetch(request, init) {
          return globalThis.fetch(request, {
            ...init,
            credentials: "include",
          })
        },
      }),
  )
  .server(
    () =>
      new RPCLink({
        ...baseRpcLinkOpts,
        headers: () => getHeaders(),
        fetch(request, init) {
          return globalThis.fetch(request, { ...init, credentials: "include" })
        },
      }),
  )

const link = getClientLink()
const orpcClient: AppRouterClient = createORPCClient(link)

export type OrpcReactQuery = RouterUtils<ContractClient>
export const orpc = createORPCReactQueryUtils(orpcClient)
