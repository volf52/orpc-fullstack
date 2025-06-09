import Loader from "@app/components/Loader"
import { routeTree } from "@app/routeTree.gen"
import { orpc } from "@app/utils/orpc"
import { queryClient } from "@app/utils/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export const createRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: { queryClient, orpc } as const,
    defaultPendingComponent: Loader,
    Wrap: Providers,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
