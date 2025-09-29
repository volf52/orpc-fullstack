import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders as getHeaders } from "@tanstack/react-start/server"
import { createAuthClient } from "better-auth/react"
import { reactStartCookies } from "better-auth/react-start"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  basePath: "/auth",
  plugins: [reactStartCookies()],
  fetchOptions: {
    credentials: "include",
  },
})

const fetchSession = async (headers?: Record<string, string>) => {
  const res = await authClient.getSession({
    fetchOptions: headers
      ? { headers, credentials: "include" }
      : { credentials: "include" },
  })
  return res.data || null
}

// Due to SSR, we need a way to fetch the session on both client and server.
// The server session fetch is being passed headers to access the cookies.
export const getAuthSession = createIsomorphicFn()
  .client(async () => {
    const session = await fetchSession()
    return { session }
  })
  .server(async () => {
    const headers = getHeaders()
    // @ts-expect-error Header type mismatch between the libraries
    const session = await fetchSession(headers)
    return { session }
  })

export const useAuthSession = () => {
  return authClient.useSession()
}

export type AppSession = typeof authClient.$Infer.Session
// type ErrorCode = keyof typeof authClient.$ERROR_CODES
