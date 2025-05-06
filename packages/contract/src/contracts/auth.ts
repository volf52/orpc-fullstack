import { CredentialsSchema, TokenSchema } from "../schemas/auth"
import { NewUserSchema, UserSchema } from "../schemas/user"
import { appAuthenticatedBase, appPublicBase } from "../utils/oc.base"

export const signup = appPublicBase
  .route({
    method: "POST",
    path: "/auth/signup",
    summary: "Register new user",
    tags: ["auth"],
  })
  .input(NewUserSchema)
  .output(UserSchema)

export const signin = appPublicBase
  .route({
    method: "POST",
    path: "/auth/signin",
    summary: "Sign in user",
    tags: ["auth"],
  })
  .input(CredentialsSchema)
  .output(TokenSchema)
  .errors({
    INVALID_CREDENTIALS: {
      status: 401,
      message: "Invalid credentials",
    },
  })

export const whoami = appAuthenticatedBase
  .route({
    method: "GET",
    path: "/auth/me",
    summary: "Get current user",
    tags: ["auth"],
  })
  .output(UserSchema)
