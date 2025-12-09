import staticPlugin from "@elysiajs/static"
import { OpenAPIGenerator } from "@orpc/openapi"
import Elysia from "elysia"
// import { experimental_ZodToJsonSchemaConverter as ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
// import { ZodToJsonSchemaConverter } from "@orpc/zod"
import type { DependencyContainer } from "tsyringe"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"
import config from "@/infra/config"
import { router } from "../router"
import { EffectSchemaConverter } from "./effect-schema-converter"

const BASIC_AUTH_STR = `docs:${config.auth.DOCS_AUTH_PASS}`
const BASIC_AUTH_STR_ENC = Buffer.from(BASIC_AUTH_STR, "ascii").toString(
  "base64",
)
const EXPECTED_BASIC_AUTH_HEADER = `Basic ${BASIC_AUTH_STR_ENC}`

const generator = new OpenAPIGenerator({
  // schemaConverters: [new ZodToJsonSchemaConverter()],
  schemaConverters: [new EffectSchemaConverter()],
})

export const elysiaOpenApiDocs = async (container: DependencyContainer) => {
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

  const contractSpecs = await generator.generate(router, {
    info: {
      title: "Carbonteq Starter API",
      version: "0.0.0",
    },
    servers: [{ url: "/api", description: "JSON-REST API" }],
  })

  const docsPlugin = new Elysia({
    name: "openapi-docs",
  }).guard(
    {
      beforeHandle({ request, status, set }) {
        const auth = request.headers.get("Authorization")
        if (!auth || auth !== EXPECTED_BASIC_AUTH_HEADER) {
          set.headers["www-authenticate"] = "Basic"
          return status(401, "Cannot access the docs")
        }
      },
    },
    (app) =>
      app
        .get("/spec/better-auth.json", () => authSpecs)
        .get("/spec/contract.json", () => contractSpecs)
        .use(staticPlugin({ assets: "static", prefix: "/docs" })),
  )

  return docsPlugin
}
