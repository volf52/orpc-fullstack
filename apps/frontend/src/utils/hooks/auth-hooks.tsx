"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "../auth-client"

const handleAuthResponse = <T, E>(res: { data: T | null; error: E | null }) => {
  if (res.error) {
    throw res.error
  }

  return res.data as T
}

const SESSION_KEY = ["auth", "session"] as const

export const useSession = () => {
  const {
    isPending,
    data: session,
    isLoading,
  } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      const res = await authClient.getSession()
      return handleAuthResponse(res)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  return { isPending: isPending, isLoading, session }
}

export const useUser = () => {
  const { session, isPending, isLoading } = useSession()

  return { user: session?.user || null, isPending, isLoading }
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
