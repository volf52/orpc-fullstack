import { implement } from "@orpc/server"
import { CONTRACT } from "@repo/contract/contracts"
import type { AppContext } from "@/web/types"

// export const pub = implement(CONTRACT.public)
export const authenticated = implement(CONTRACT.authenticated)
  .$context<AppContext>()
  .use(({ context, next, errors }) => {
    const user = context.auth?.user
    const session = context.auth?.session

    if (!user || !session) {
      throw errors.NotAuthenticated()
    }

    return next({ context: { user, session } })
  })
