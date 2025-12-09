// biome-ignore assist/source/organizeImports: Need reflect-metadata for decorators
import "reflect-metadata"

import { Elysia } from "elysia"
// import { openapi, fromTypes } from "@elysiajs/openapi"
import { serverTiming } from "@elysiajs/server-timing"
import { opentelemetry } from "@elysiajs/opentelemetry"
import { elysiaOrpcOAI } from "./utils/openapi.handler"
import { elysiaOrpcRPC } from "./utils/rpc.handler"
import { container } from "tsyringe"
import { getElysiaAuthRouter } from "./router/auth"
import config from "@/infra/config"
import { elysiaOpenApiDocs } from "./utils/openapidocs.handler"
import { wireDi } from "@/infra/di"
import { logger as elysiaLogger } from "@bogeychan/elysia-logger"
import { cors as elysiaCors } from "@elysiajs/cors"

await wireDi()

const isDev = config.app.NODE_ENV === "development"
const isProd = config.app.NODE_ENV === "production"

const elysiaApp = new Elysia({
  // setting this to false leads to 'Body already consumed' errors, and even explicit undefined causes issues with preflight
  // aot: isProd ? true : undefined,
  // precompile: isProd,
  precompile: isProd || isDev,
})
  .use(
    elysiaCors({
      // origin: CORS_TRUSTED_ORIGINS,
      origin: isDev ? true : config.app.TRUSTED_ORIGIN,
      credentials: true,
      exposeHeaders: isDev ? true : ["Set-Cookie", "Authorization"],
      methods: isDev
        ? true
        : ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    }),
  )
  // .use(
  //   openapi({
  //     enabled: isDev,
  //     references: fromTypes(),
  //   }),
  // )
  .use(
    elysiaLogger({
      autoLogging: isDev,
    }),
  )
  .use(serverTiming({ enabled: true }))
  .use(opentelemetry({ spanProcessors: [] }))
  .use(elysiaOpenApiDocs(container)) // /docs OpenAI API endpoint with better-auth + orpc
  .use(getElysiaAuthRouter(container)) // /auth/* register better-auth auth routes
  .use(elysiaOrpcRPC(container)) // /rpc/* register ORPC RPC handler
  .use(elysiaOrpcOAI(container)) // /api/* register ORPC OpenAPI handler

if (isDev) {
  elysiaApp.get("/routes", async () => {
    const routes = elysiaApp.routes.map((route) => ({
      method: route.method,
      url: route.path,
    }))

    return routes
  })
}

export default {
  fetch: elysiaApp.fetch,
  port: config.app.PORT,
}
