import DefaultErrorBoundary from "@app/components/layout/DefaultErrorBoundary"
import PageNotFound from "@app/components/layout/PageNotFound"
import { routeTree } from "@app/routeTree.gen"
import { orpc } from "@app/shared/orpc"
import { queryClient } from "@app/shared/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import { PageSuspenseFallback } from "./components/layout/PageSuspenseFallback"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient, orpc } as const,
    defaultPreload: "intent",
    defaultPendingComponent: PageSuspenseFallback,
    defaultNotFoundComponent: () => <PageNotFound />,
    defaultErrorComponent: DefaultErrorBoundary,
    Wrap: Providers,
  })

  return routerWithQueryClient(router, queryClient)
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
