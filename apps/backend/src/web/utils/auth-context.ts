import type { Context as HonoContext } from "hono"
import type { DependencyContainer } from "tsyringe"
import { AuthService } from "@/infra/auth/auth.service"

export const createAuthContext = async (
  c: HonoContext,
  container: DependencyContainer,
) => {
  const authServ = container.resolve(AuthService)

  const ctx = await authServ.getUser(c.req.raw.headers)

  return ctx
}

export type AuthContext = Awaited<ReturnType<typeof createAuthContext>>
