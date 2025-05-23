import { authenticated } from "../utils/orpc"
import type { DependencyContainer } from "tsyringe"
import type { Hono } from "hono"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"

export const initAuthRouter = (app: Hono, container: DependencyContainer) => {
  const auth = resolveAuthFromContainer(container)

  app.on(["GET", "POST"], "/api/auth/**", (c) => auth.handler(c.req.raw))

  return app
}

export const whoamiHandler = authenticated.auth.whoami.handler(
  async ({ context }) => {
    return context.user
  },
)
