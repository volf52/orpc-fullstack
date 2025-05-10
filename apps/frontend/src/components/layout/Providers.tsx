"use client"

// import { AuthProvider } from "@/utils/contexts/auth-context"
import { ORPCProvider } from "@/utils/contexts/orpc-context"
import { getQueryClient } from "@/utils/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

type Props = {
  children: React.ReactNode
}

const Providers = ({ children }: Props) => {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCProvider>{children}</ORPCProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export default Providers
