import { Elysia } from "elysia"
import type { DependencyContainer } from "tsyringe"
import { AuthService } from "@/infra/auth/auth.service"

export type AuthContext = Awaited<ReturnType<AuthService["getUser"]>>
type ExpectedResult = {
  auth: AuthContext
}

// https://www.better-auth.com/docs/integrations/elysia#macro
// https://elysiajs.com/patterns/extends-context.html#resolve
// choosing to go with resolve as macro requires explicit setting in the third handler param
export const getAuthCtxPlugin = (container: DependencyContainer) => {
  const authServ = container.resolve(AuthService)

  const app = new Elysia({
    name: "auth-context",
  })
    // https://elysiajs.com/essential/plugin.html#inline-as
    // allow downstream handlers to use auth in a typesafe manner
    .resolve({ as: "scoped" }, async ({ request: { headers } }) => {
      const auth = await authServ.getUser(headers)

      return { auth } satisfies ExpectedResult
    })

  return app
}
