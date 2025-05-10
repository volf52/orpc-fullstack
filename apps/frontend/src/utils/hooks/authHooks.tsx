import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "../auth-client"

const SESSION_KEY = ["auth", "session"] as const

export const useSession = () => {
  const {
    isPending,
    data: session,
    isLoading,
  } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: () => authClient.getSession(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  return { isPending: isPending, isLoading, session }
}

export const useUser = () => {
  const { session, isPending, isLoading } = useSession()

  return { user: session?.data?.user || null, isPending, isLoading }
}

export const useSignIn = () => {
  const queryClient = useQueryClient()

  const signIn = useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      authClient.signIn.email(creds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY })
    },
  })

  return signIn
}

export const useSignout = () => {
  const queryClient = useQueryClient()

  const signout = useMutation({
    mutationFn: () => authClient.signOut(),
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
      if (res.error) {
        throw res.error
      }

      return res.data
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
