import { RPCHandler } from "@orpc/server/fetch"
import type { Hono } from "hono"
import { router } from "../router"
import { createContext } from "./context"
import { validationErrMap } from "./interceptors"
import { onError } from "@orpc/server"
import type { DependencyContainer } from "tsyringe"

export const addRpcHandler = (app: Hono, container: DependencyContainer) => {
  const rpcHandler = new RPCHandler(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [],
  })

  app.use("/rpc/*", async (c, next) => {
    const context = await createContext(c, container)

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
