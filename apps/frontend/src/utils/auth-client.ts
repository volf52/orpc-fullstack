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
