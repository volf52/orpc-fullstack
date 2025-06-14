import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import { BatchHandlerPlugin } from "@orpc/server/plugins"
import { router } from "@web/router"
import type { AppContext } from "@web/types"
import type { Hono } from "hono"
import type { DependencyContainer } from "tsyringe"
import { createAuthContext } from "./auth-context"
import { commonPlugins } from "./common-plugins"
import { validationErrMap } from "./interceptors"

export const addRpcHandler = (app: Hono, container: DependencyContainer) => {
  const rpcHandler = new RPCHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [...commonPlugins, new BatchHandlerPlugin()],
  })

  app.use("/rpc/*", async (c, next) => {
    const context = await createAuthContext(c, container)
    const rpcRes = await rpcHandler.handle(c.req.raw, {
      prefix: "/rpc",
      context: { auth: context },
    })

    if (rpcRes.matched) {
      return c.newResponse(rpcRes.response.body, rpcRes.response)
    }

    return await next()
  })
}
