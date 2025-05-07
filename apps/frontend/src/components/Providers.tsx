"use client"

import { AuthProvider } from "@/utils/contexts/auth-context"
import { orpc, ORPCCOntext, queryClient } from "@/utils/orpc"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type Props = {
  children: React.ReactNode
}
const Providers = ({ children }: Props) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ORPCCOntext.Provider value={orpc}>{children}</ORPCCOntext.Provider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers
