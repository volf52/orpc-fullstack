import type { Hono } from "hono"
import type { DependencyContainer } from "tsyringe"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"

export const initAuthRouter = (app: Hono, container: DependencyContainer) => {
  const auth = resolveAuthFromContainer(container)

  app.on(["GET", "POST"], "/auth/**", (c) => auth.handler(c.req.raw))

  return app
}
