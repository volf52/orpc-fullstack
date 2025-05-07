import "reflect-metadata"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { serve } from "@hono/node-server"
import { addOpenApiHandler } from "./utils/openapi.handler"
import { addRpcHandler } from "./utils/rpc.handler"

const app = new Hono()
app.use(logger())

addOpenApiHandler(app)
addRpcHandler(app)

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (addr) => {
    console.log(`Server is running on http://localhost:${addr.port}`)
  },
)
