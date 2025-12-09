import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { BatchHandlerPlugin } from "@orpc/server/plugins"
import { router } from "@web/router"
import type { AppContext } from "@web/types"
import Elysia from "elysia"
import type { DependencyContainer } from "tsyringe"
import { getAuthCtxPlugin } from "./auth.plugin"
import { commonPlugins } from "./common-plugins"
import { validationErrMap } from "./interceptors"

export const elysiaOrpcRPC = (container: DependencyContainer) => {
  const rpcHandler = new RPCHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [...commonPlugins, new BatchHandlerPlugin()],
  })

  return new Elysia({
    name: "orpc-rpc",
    prefix: "/rpc",
  })
    .use(getAuthCtxPlugin(container)) // provides AuthCtx
    .get("/ping", async () => {
      return {
        pong: true,
      }
    })
    .all(
      "/*",
      async ({ request, auth }) => {
        const { response } = await rpcHandler.handle(request, {
          prefix: "/rpc",
          context: { auth },
        })

        return response ?? new Response(null, { status: 404 })
      },
      { parse: "none" },
    )
}
