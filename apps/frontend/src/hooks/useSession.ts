import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

interface Session {
  id: string
  email: string
  name: string
}

export const useSession = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: session } = useQuery<Session>({
    queryKey: ["session"],
    // TODO: Replace with actual session check endpoint
    queryFn: async () => {
      const response = await fetch("/api/auth/session")
      if (!response.ok) {
        throw new Error("Not authenticated")
      }
      return response.json()
    },
    retry: false,
  })

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual logout endpoint
      await fetch("/api/auth/logout", { method: "POST" })
    },
    onSuccess: () => {
      queryClient.setQueryData(["session"], null)
      navigate({ to: "/auth/login" })
    },
  })

  return {
    session,
    logout,
  }
}
