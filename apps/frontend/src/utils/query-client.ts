import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000, // 1 minute
      // retry: 3,
      // refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
    mutations: {
      throwOnError: false, // Never throw errors for mutations
    },
  },
})
