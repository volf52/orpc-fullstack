// import { CredentialsSchema, TokenWithUserSchema } from "../schemas/auth"
import { UserSchema } from "../schemas/user"
import { appAuthenticatedBase } from "../utils/oc.base"

// export const signup = appPublicBase
//   .route({
//     method: "POST",
//     path: "/auth/signup",
//     summary: "Register new user",
//     tags: ["auth"],
//   })
//   .errors({
//     AlreadyExists: {
//       status: 409,
//       message: "User already exists",
//     },
//   })
//   .input(NewUserSchema)
//   .output(UserSchema)
//
// export const signin = appPublicBase
//   .route({
//     method: "POST",
//     path: "/auth/signin",
//     summary: "Sign in user",
//     tags: ["auth"],
//   })
//   .input(CredentialsSchema)
//   .output(TokenWithUserSchema)
//   .errors({
//     INVALID_CREDENTIALS: {
//       status: 401,
//       message: "Invalid credentials",
//     },
//   })

export const whoami = appAuthenticatedBase
  .route({
    method: "GET",
    path: "/auth/whoami",
    summary: "Get current user",
    tags: ["user"],
  })
  .output(UserSchema)
