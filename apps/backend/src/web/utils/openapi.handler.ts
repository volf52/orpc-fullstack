import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins"
import { onError } from "@orpc/server"
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod"
import { router } from "@web/router"
import type { Hono, MiddlewareHandler } from "hono"
import type { DependencyContainer } from "tsyringe"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"
import config from "@/infra/config"
import { createContext } from "./context"
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

export const addOpenApiHandler = async (
  app: Hono,
  container: DependencyContainer,
) => {
  const auth = resolveAuthFromContainer(container)
  const authSchema = await auth.api.generateOpenAPISchema()

  authSchema.tags = authSchema.tags.map((t) => {
    if (t.name !== "Default") return t

    return { name: "auth", description: "Authentication with BetterAuth" }
  })

  authSchema.paths = Object.fromEntries(
    Object.entries(authSchema.paths).map(([uri, specs]) => {
      if (specs.get?.tags) {
        specs.get.tags = specs.get.tags.map((t) =>
          t === "Default" ? "auth" : t,
        )
      }
      if (specs.post?.tags) {
        specs.post.tags = specs.post.tags.map((t) =>
          t === "Default" ? "auth" : t,
        )
      }

      return [uri, specs]
    }),
  )

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
          security: [...authSchema.security],
          tags: [...authSchema.tags],
          servers: [
            ...authSchema.servers,
            { url: "/api", description: "This server" },
          ],
          //@ts-expect-error
          paths: { ...authSchema.paths },
          components: {
            schemas: { ...authSchema.components.schemas },
            //@ts-expect-error
            securitySchemes: {
              ...authSchema.components.securitySchemes,
            },
          },
        },
      }),
    ],
  })

  app.use("/api/docs", docsBasicAuth)
  app.use("/api/spec.json", docsBasicAuth)

  app.use("/api/*", async (c, next) => {
    const context = await createContext(c, container)

    const openApiRes = await openApiHandler.handle(c.req.raw, {
      prefix: "/api",
      context: { auth: context },
    })

    if (openApiRes.matched) {
      return c.newResponse(openApiRes.response.body, openApiRes.response)
    }

    return await next()
  })
}
