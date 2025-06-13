import { createAuthClient } from "better-auth/react"
// import {
//   adminClient,
//   magicLinkClient,
//   ssoClient,
//   twoFactorClient,
//   usernameClient,
//   phoneNumberClient,
// } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [],
})

export type AppSession = typeof authClient.$Infer.Session
type ErrorCode = keyof typeof authClient.$ERROR_CODES

// type ErrorCodeHandlers = Record<ErrorCode, (error: BetterFetchError) => void>
//
// type HandleAuthErrorArgs = {
//   handlers?: ErrorCodeHandlers
//   throwOnUnhandled?: boolean
// }
//
// export const handleAuthError = (error: unknown, opts?: HandleAuthErrorArgs) => {
//   const { handlers = {}, throwOnUnhandled = false } = opts ?? {}
//
//   if (error instanceof BetterFetchError) {
//     const code = error
//   } else if (throwOnUnhandled) {
//     throw error
//   }
// }
