import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [],
})
