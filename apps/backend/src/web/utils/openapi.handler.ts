import type { Hono, MiddlewareHandler } from "hono"
import { router } from "../router"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins"
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod"
import config from "@/infra/config"
import { createContext } from "./context"
import { onError } from "@orpc/server"
import { validationErrMap } from "./interceptors"

const BASIC_AUTH_STR = `docs:${config.auth.DOCS_AUTH_PASS}`
const BASIC_AUTH_STR_ENC = Buffer.from(BASIC_AUTH_STR, "ascii").toString(
  "base64",
)
const EXPECTED_BASIC_AUTH_HEADER = `Basic ${BASIC_AUTH_STR_ENC}`

const docsBasicAuth: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header("Authorization")
  if (!auth || auth !== EXPECTED_BASIC_AUTH_HEADER) {
    return c.text("Cannot access the docs", 401, {
      "WWW-Authenticate": "Basic",
    })
  }

  return await next()
}

export const addOpenApiHandler = (app: Hono) => {
  const openApiHandler = new OpenAPIHandler(router, {
    interceptors: [onError(validationErrMap)],
    clientInterceptors: [],
    plugins: [
      new ZodSmartCoercionPlugin(),
      new OpenAPIReferencePlugin({
        schemaConverters: [new ZodToJsonSchemaConverter()],
        docsPath: "/docs",
        specGenerateOptions: {
          info: { title: "Ct-Starter API", version: "1.0.0" },
          security: [{ bearerAuth: [] }],
          components: {
            securitySchemes: {
              bearerAuth: { type: "http", scheme: "bearer" },
            },
          },
        },
      }),
    ],
  })

  app.use("/api/docs", docsBasicAuth)
  app.use("/api/spec.json", docsBasicAuth)

  app.use("/api/*", async (c, next) => {
    const context = await createContext(c)

    const openApiRes = await openApiHandler.handle(c.req.raw, {
      prefix: "/api",
      context,
    })

    if (openApiRes.matched) {
      return c.newResponse(openApiRes.response.body, openApiRes.response)
    }

    return await next()
  })
}
