import { appAuthenticatedBase } from "@contract/utils/oc.base"
import type { UserEncoded } from "@domain/entities/user.entity"
import { type } from "@orpc/contract"

const userBase = appAuthenticatedBase

export const whoami = userBase
  .route({
    method: "GET",
    path: "/user/whoami",
    summary: "Get current user",
    tags: ["user"],
  })
  .input(type<void>()) // No input required
  .output(type<UserEncoded>())

export default { whoami }
