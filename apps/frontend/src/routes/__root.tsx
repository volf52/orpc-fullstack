import Navbar from "@app/components/layout/Navbar"
import { Box } from "@styled/jsx"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import Toaster from "@ui/toast/toaster"
import "./globals.css"
// import "@styled/styles.css"
import type { OrpcReactQuery } from "@app/utils/orpc"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export interface RouterAppContext {
  orpc: OrpcReactQuery
  queryClient: QueryClient
}

const RootComponent = () => {
  // const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <>
      <Navbar />
      <Box
        bgGradient="to-br"
        gradientFrom="teal.a5"
        gradientTo="teal.a2"
        minH="90vh"
        pt="4">
        <Outlet />
      </Box>
      <Toaster />

      {process.env.NODE_ENV === "development" && (
        <>
          <ReactQueryDevtools
            buttonPosition="bottom-right"
            initialIsOpen={false}
            position="bottom"
          />
          <TanStackRouterDevtools
            initialIsOpen={false}
            position="bottom-left"
          />
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})
