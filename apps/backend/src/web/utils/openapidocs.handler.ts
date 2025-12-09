import { fromTypes, openapi } from "@elysiajs/openapi"
import { OpenAPIGenerator } from "@orpc/openapi"
import { JSONSchema } from "effect"
import { Elysia } from "elysia"
import type { DependencyContainer } from "tsyringe"
import z from "zod"
import { IS_DEV, IS_PROD } from "@/constants"
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

      return [`/auth${uri}`, specs]
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
  if (contractSpecs.paths) {
    contractSpecs.paths = Object.fromEntries(
      Object.entries(contractSpecs.paths).map(([uri, specs]) => {
        return [`/api${uri}`, specs]
      }),
    )
  }

  const docsPlugin = new Elysia({
    name: "openapi-docs",
  }).guard(
    {
      beforeHandle({ request, status, set }) {
        if (IS_DEV) {
          return
        }
        const auth = request.headers.get("Authorization")
        if (!auth || auth !== EXPECTED_BASIC_AUTH_HEADER) {
          set.headers["www-authenticate"] = "Basic"
          return status(401, "Cannot access the docs")
        }
      },
    },
    (app) =>
      app.use(
        openapi({
          path: "/docs",
          provider: "scalar",
          mapJsonSchema: {
            zod: z.toJSONSchema,
            effect: JSONSchema.make,
          },
          documentation: {
            info: {
              title: "Carbonteq Starter API",
              description:
                "This is the API documentation for the Carbonteq Starter project. It provides details about the available endpoints, request/response formats, and authentication methods.",
              version: "0.0.1",
            },
            // TODO: fix the type errors here (runtime is ok)
            // @ts-expect-error: later
            components: {
              ...contractSpecs.components,
              ...authSpecs.components,
            },
            // @ts-expect-error: runtime ok
            paths: {
              ...contractSpecs.paths,
              ...authSpecs.paths,
            },
          },
          // references: fromTypes("src/web/server.ts"),
          scalar: {
            theme: "kepler",
            // theme: "bluePlanet",
            // theme: "deepSpace",
            darkMode: true,
            layout: "modern",
            hideClientButton: true,
            showDeveloperTools: IS_PROD ? "never" : undefined,
            // sources: [
            //   {
            //     title: "API Docs (Contract)",
            //     slug: "contract",
            //     default: true,
            //     url: "/spec/contract.json",
            //   },
            //   {
            //     title: "Better Auth",
            //     slug: "better-auth",
            //     url: "/spec/better-auth.json",
            //   },
            // ],
          },
        }),
      ),
    // .get("/spec/better-auth.json", () => authSpecs)
    // .get("/spec/contract.json", () => contractSpecs)
    // .get("/docs", () => file("static/scalar.html")),
  )

  return docsPlugin
}
