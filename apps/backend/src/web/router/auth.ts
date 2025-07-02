import type { Hono } from "hono"
import type { DependencyContainer } from "tsyringe"
import { AuthService } from "@/infra/auth/auth.service"

export const initAuthRouter = (app: Hono, container: DependencyContainer) => {
  const authServ = container.resolve(AuthService)

  app.on(["GET", "POST"], "/auth/**", (c) =>
    authServ.getAuthInstance().handler(c.req.raw),
  )

  return app
}
