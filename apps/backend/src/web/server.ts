import "reflect-metadata"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { serve } from "@hono/node-server"
import { addOpenApiHandler } from "./utils/openapi.handler"
import { addRpcHandler } from "./utils/rpc.handler"
import { resolveAuth, resolveAuthFromContainer } from "@/infra/auth/better-auth"
import { container } from "tsyringe"
import { initAuthRouter } from "./router/auth"

const app = new Hono()
app.use(logger())
app.use(
  "/*",
  cors({
    // TODO: move to config
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

initAuthRouter(app, container)
addOpenApiHandler(app, container)
addRpcHandler(app, container)

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (addr) => {
    console.log(`Server is running on http://localhost:${addr.port}`)
  },
)
