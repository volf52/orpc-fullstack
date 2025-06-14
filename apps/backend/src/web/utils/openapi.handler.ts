import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { onError } from "@orpc/server"
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin } from "@orpc/zod"
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
    console.debug("OpenAPI request received:", c.req.raw.url)
    const authCtx = await createAuthContext(c, container)
    console.debug("OpenAPI request context:", authCtx)

    const openApiRes = await openApiHandler.handle(c.req.raw, {
      prefix: "/api",
      context: { auth: authCtx },
    })

    if (openApiRes.matched) {
      console.debug("OpenAPI response matched:", openApiRes.response.status)
      return c.newResponse(openApiRes.response.body, openApiRes.response)
    }
    console.debug("OpenAPI response not matched, passing to next middleware")

    return await next()
  })
}
