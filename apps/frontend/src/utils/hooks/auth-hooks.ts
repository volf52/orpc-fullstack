import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authClient } from "../auth-client"
import { toast } from "../toast"

const handleAuthResponse = <T, E>(res: { data: T | null; error: E | null }) => {
  if (res.error) {
    throw res.error
  }

  return res.data as T
}

export const useSignIn = () => {
  const signIn = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const res = await authClient.signIn.email(creds)

      return handleAuthResponse(res)
    },
    // onSuccess: () => {},
  })

  return signIn
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

    onSuccess: () => {},
    onError: (err) => {
      toast.error({
        title: err.name,
        message: err.message,
      })
    },
  })

  return signUp
}
