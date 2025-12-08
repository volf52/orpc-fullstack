import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"

type ProviderProps = {
  queryClient: QueryClient
  children: React.ReactNode
}

export const Providers = ({ queryClient, children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
