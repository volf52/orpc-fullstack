import {
  queryOptions,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { type AppSession, authClient } from "../auth-client"
import { toast } from "../toast"

const handleAuthResponse = <T, E>(res: { data: T | null; error: E | null }) => {
  if (res.error) {
    throw res.error
  }

  return res.data as T
}

const SESSION_KEY = ["auth", "session"] as const
const getSessionFunc = async () => {
  const res = await authClient.getSession()
  return handleAuthResponse(res)
}
export const sessionQueryOptions = () =>
  queryOptions<AppSession>({
    queryKey: SESSION_KEY,
    queryFn: getSessionFunc,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

export const useSession = () => useQuery(sessionQueryOptions())

const selectUser = (session?: AppSession) => session?.user
export const useUser = () =>
  useSuspenseQuery({
    ...sessionQueryOptions(),
    select: selectUser,
  })

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

const SignoutMutKey = ["auth", "signout"] as const
export const useSignout = () => {
  const queryClient = useQueryClient()

  const signout = useMutation({
    mutationKey: SignoutMutKey,
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

export const useIsSigningOut = () =>
  useIsMutating({ mutationKey: SignoutMutKey }) > 0

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
      toast.error({
        title: err.name,
        message: err.message,
      })
    },
  })

  return signUp
}
