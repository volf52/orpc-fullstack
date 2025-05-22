"use client"

import { ORPCProvider } from "@/utils/contexts/orpc-context"
import { getQueryClient } from "@/utils/query-client"
import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

type Props = {
  children: React.ReactNode
}

const Providers = ({ children }: Props) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ORPCProvider>{children}</ORPCProvider>
        {process.env.NODE_ENV === "development" && (
          <>
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools initialIsOpen={false} />
          </>
        )}
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export default Providers
