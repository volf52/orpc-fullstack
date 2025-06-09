import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { type AppSession, authClient } from "../auth-client"

const handleAuthResponse = <T, E>(res: { data: T | null; error: E | null }) => {
  if (res.error) {
    throw res.error
  }

  return res.data as T
}

const SESSION_KEY = ["auth", "session"] as const

type SessionSelectFn<T> = (data: AppSession) => T

export const useSession = <T>(select?: SessionSelectFn<T>) => {
  return useQuery({
    queryKey: SESSION_KEY,
    select,
    queryFn: async () => {
      const res = await authClient.getSession()
      return handleAuthResponse(res)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useUser = () => {
  const select = useCallback((session: AppSession) => session.user, [])

  return useSession(select)
}

export const useSignIn = () => {
  const queryClient = useQueryClient()

  const signIn = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const res = await authClient.signIn.email(creds)

      return handleAuthResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })

  return signIn
}

export const useSignout = () => {
  const queryClient = useQueryClient()

  const signout = useMutation({
    mutationFn: async () => {
      const res = await authClient.signOut()
      return handleAuthResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
    throwOnError: false,
  })

  return signout
}

export const useSignUp = () => {
  const queryClient = useQueryClient()

  const signUp = useMutation({
    mutationFn: async (creds: {
      email: string
      password: string
      name: string
    }) => {
      const res = await authClient.signUp.email(creds)
      return handleAuthResponse(res)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
    onError: (err) => {
      console.debug(err)
    },
  })

  return signUp
}
