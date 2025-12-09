import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { onError } from "@orpc/server"
import { ResponseHeadersPlugin } from "@orpc/server/plugins"
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import { router } from "@web/router"
import Elysia from "elysia"
import type { DependencyContainer } from "tsyringe"
import type { AppContext } from "../types"
import { getAuthCtxPlugin } from "./auth.plugin"
import { validationErrMap } from "./interceptors"

export const elysiaOrpcOAI = (container: DependencyContainer) => {
  const oaiHandler = new OpenAPIHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [
      new ResponseHeadersPlugin(),
      new SmartCoercionPlugin({
        schemaConverters: [new ZodToJsonSchemaConverter()],
      }),
    ],
  })

  return new Elysia({
    name: "orpc-openapi",
    prefix: "/api",
  })
    .use(getAuthCtxPlugin(container))
    .get("/ping", () => ({ pong: true }))
    .all(
      "/*",
      async ({ request, auth }) => {
        const { response } = await oaiHandler.handle(request, {
          prefix: "/api",
          context: { auth },
        })

        return response ?? new Response(null, { status: 404 })
      },
      { parse: "none" },
    )
}
