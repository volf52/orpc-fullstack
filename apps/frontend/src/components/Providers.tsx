"use client"

import { AuthProvider } from "@/utils/contexts/auth-context"
import { ORPCProvider } from "@/utils/contexts/orpc-context"
import { queryClient } from "@/utils/orpc"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type Props = {
  children: React.ReactNode
}
const Providers = ({ children }: Props) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ORPCProvider>{children}</ORPCProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers
