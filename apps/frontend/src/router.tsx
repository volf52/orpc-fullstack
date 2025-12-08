import DefaultErrorBoundary from "@app/components/layout/DefaultErrorBoundary"
import PageNotFound from "@app/components/layout/PageNotFound"
import { routeTree } from "@app/routeTree.gen"
import { orpc } from "@app/shared/orpc"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { PageSuspenseFallback } from "./components/layout/PageSuspenseFallback"
import { Providers } from "./providers"
import { getQueryClient } from "./shared/query-client"

export const getRouter = () => {
  const qc = getQueryClient()

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient: qc, orpc } as const,
    defaultPreload: "intent",
    defaultPendingComponent: PageSuspenseFallback,
    defaultNotFoundComponent: () => <PageNotFound />,
    defaultErrorComponent: DefaultErrorBoundary,
    Wrap: ({ children }) => <Providers queryClient={qc}>{children}</Providers>,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: qc })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
