import { UserSchema } from "@contract/schemas/user"
import { appAuthenticatedBase } from "@contract/utils/oc.base"

export const whoami = appAuthenticatedBase
  .route({
    method: "GET",
    path: "/auth/whoami",
    summary: "Get current user",
    tags: ["user"],
  })
  .output(UserSchema)
