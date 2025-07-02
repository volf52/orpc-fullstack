import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { onError } from "@orpc/server"
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins"
import { experimental_ZodSmartCoercionPlugin as ZodSmartCoercionPlugin } from "@orpc/zod/zod4"
import { router } from "@web/router"
import type { Hono } from "hono"
import type { DependencyContainer } from "tsyringe"
import type { AppContext } from "../types"
import { createAuthContext } from "./auth-context"
import { validationErrMap } from "./interceptors"

export const addOpenApiHandler = async (
  app: Hono,
  container: DependencyContainer,
) => {
  const openApiHandler = new OpenAPIHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [
      new CORSPlugin(),
      new ResponseHeadersPlugin(),
      new ZodSmartCoercionPlugin(),
    ],
  })

  return app.use("/api/*", async (c, next) => {
    const authCtx = await createAuthContext(c, container)

    const openApiRes = await openApiHandler.handle(c.req.raw, {
      prefix: "/api",
      context: { auth: authCtx },
    })

    if (openApiRes.matched) {
      return c.newResponse(openApiRes.response.body, openApiRes.response)
    }

    return await next()
  })
}
