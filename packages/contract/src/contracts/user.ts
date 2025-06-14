import type { User } from "@contract/schemas/user"
import { appAuthenticatedBase } from "@contract/utils/oc.base"
import { type } from "@orpc/contract"

const userBase = appAuthenticatedBase

export const whoami = userBase
  .route({
    method: "GET",
    path: "/user/whoami",
    summary: "Get current user",
    tags: ["user"],
  })
  .input(type<never>()) // No input required
  .output(type<User>())

export default { whoami }
