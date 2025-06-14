import { OpenAPIGenerator } from "@orpc/openapi"
// import { experimental_ZodToJsonSchemaConverter as ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import { ZodToJsonSchemaConverter } from "@orpc/zod"
import type { Hono } from "hono"
import { serveStatic } from "hono/bun"
import type { MiddlewareHandler } from "hono/types"
import type { DependencyContainer } from "tsyringe"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"
import config from "@/infra/config"
import { router } from "../router"

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

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

export const addOpenApiDocs = async (
  app: Hono,
  container: DependencyContainer,
) => {
  console.debug("Adding OpenAPI docs handler")

  const auth = resolveAuthFromContainer(container)
  const authSpecs = await auth.api.generateOpenAPISchema()
  const authTag = {
    name: "auth",
    description: "Authentication with BetterAuth",
  }
  authSpecs.tags = authSpecs.tags.map((t) => {
    if (t.name !== "Default") return t

    return authTag
  })
  authSpecs.paths = Object.fromEntries(
    Object.entries(authSpecs.paths).map(([uri, specs]) => {
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

  const contractSpecs = await generator.generate(router, {
    info: {
      title: "Carbonteq Starter API",
      version: "0.0.0",
    },
    servers: [{ url: "/api", description: "JSON-REST API" }],
  })

  // if (authSpecs.components?.securitySchemes) {
  //   contractSpecs.components = contractSpecs.components || {}
  //   contractSpecs.components.securitySchemes =
  //     contractSpecs.components.securitySchemes || {}
  //   contractSpecs.components.securitySchemes = {
  //     ...contractSpecs.components.securitySchemes,
  //     ...authSpecs.components.securitySchemes,
  //   }
  //   contractSpecs.security = contractSpecs.security || []
  //   contractSpecs.security.push(...(authSpecs.security || []))
  // }

  return app
    .use(docsBasicAuth)
    .get("/spec/better-auth.json", (c) => c.json(authSpecs))
    .get("/spec/contract.json", (c) => c.json(contractSpecs))
    .get("/docs", serveStatic({ path: "static/scalar.html" }))
}
