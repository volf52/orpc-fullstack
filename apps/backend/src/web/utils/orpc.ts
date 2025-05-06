import { implement } from "@orpc/server"
import { CONTRACT } from "@repo/contract/contracts"
import type { AppContext } from "../types"

export const pub = implement(CONTRACT.public)
export const authenticated = implement(CONTRACT.authenticated)
  .$context<AppContext>()
  .use(({ context, next, errors }) => {
    if (!context.user) {
      throw errors.NO_USER()
    }

    return next({ context: { user: context.user } })
  })
