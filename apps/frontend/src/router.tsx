import DefaultErrorBoundary from "@app/components/layout/DefaultErrorBoundary"
import NotFound from "@app/components/layout/NotFound"
import { routeTree } from "@app/routeTree.gen"
import { orpc } from "@app/utils/orpc"
import { queryClient } from "@app/utils/query-client"
import { Loader } from "@mantine/core"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export const createRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient, orpc } as const,
    defaultPreload: "intent",
    defaultPreloadStaleTime: Infinity,
    defaultPendingComponent: Loader,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: DefaultErrorBoundary,
    Wrap: Providers,
  })

  return routerWithQueryClient(router, queryClient)
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
