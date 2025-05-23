import { resolveAuthFromContainer } from "@/infra/auth/better-auth"
import type { Context as HonoContext } from "hono"
import type { DependencyContainer } from "tsyringe"

export const createContext = async (
  c: HonoContext,
  container: DependencyContainer,
) => {
  const auth = resolveAuthFromContainer(container)

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  return session
}

export type AuthContext = Awaited<ReturnType<typeof createContext>>
