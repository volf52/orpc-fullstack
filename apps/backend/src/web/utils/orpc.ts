import { implement } from "@orpc/server"
import { CONTRACT } from "@repo/contract/contracts"
import type { AppContext, AuthenticatedContext } from "@/web/types"

// export const pub = implement(CONTRACT.public)
export const authenticated = implement(CONTRACT.authenticated)
  .$context<AppContext>()
  .use(({ context: { auth, ...rest }, next, errors }) => {
    const user = auth?.user
    const session = auth?.session

    if (!user || !session) {
      throw errors.NotAuthenticated()
    }

    return next<AuthenticatedContext>({
      context: { ...rest, auth: { user, session } },
    })
  })
