import DefaultErrorBoundary from "@app/components/layout/DefaultErrorBoundary"
import NotFound from "@app/components/layout/NotFound"
import PrivateLayout from "@app/components/layout/PrivateLayout"
import PublicLayout from "@app/components/layout/PublicLayout"
import { sessionQueryOptions, useSession } from "@app/utils/hooks/auth-hooks"
import type { OrpcReactQuery } from "@app/utils/orpc"
import { seo } from "@app/utils/seo"
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useMatches,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Suspense, useEffect } from "react"
import { Notifications } from "@mantine/notifications"
import { Loader } from "@mantine/core"

// Import styles through PostCSS
// import styles from "./styles.css?url"
import "./styles.css"

export interface RouterAppContext {
  orpc: OrpcReactQuery
  queryClient: QueryClient
}

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <HeadContent />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          withCssVariables
          withGlobalClasses>
          {children}
          <Notifications />
        </MantineProvider>
        {process.env.NODE_ENV === "development" ? (
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
        ) : null}
        <Scripts />
        <ColorSchemeScript defaultColorScheme="dark" />
      </body>
    </html>
  )
}

const AuthGuard = () => {
  const router = useRouter()
  const matches = useMatches()
  const navigate = useNavigate()
  const { data: session, isLoading } = useSession()

  console.log(
    "Match id is ",
    matches.map((m) => m.routeId),
  )

  // Memoize route checks to prevent unnecessary recalculations
  const isPublicRoute = matches.some((match) =>
    match.routeId.startsWith("/auth/"),
  )
  const isErrorRoute = matches.some((match) =>
    ["__root__.notFound", "__root__.error"].includes(match.routeId),
  )

  // Handle redirects during SSR
  if (typeof window === "undefined") {
    if (!isErrorRoute) {
      if (!session && !isPublicRoute) {
        router.navigate({ to: "/auth/login" })
      } else if (session && isPublicRoute) {
        router.navigate({ to: "/" })
      }
    }
  }

  // Handle client-side redirects
  useEffect(() => {
    if (!isLoading && !isErrorRoute) {
      if (!session && !isPublicRoute) {
        navigate({ to: "/auth/login" })
      } else if (session && isPublicRoute) {
        navigate({ to: "/" })
      }
    }
  }, [session, isPublicRoute, isErrorRoute, isLoading, navigate])

  // Show loading state during initial session check
  if (isLoading) {
    return <Loader />
  }

  // Don't render anything if we're redirecting
  if (
    !isErrorRoute &&
    ((!session && !isPublicRoute) || (session && isPublicRoute))
  ) {
    return null
  }

  return isPublicRoute ? (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ) : (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  )
}

const RootComponent = () => {
  return (
    <RootDocument>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthGuard />
      </Suspense>
    </RootDocument>
  )
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: (props) => (
    <RootDocument>
      <DefaultErrorBoundary {...props} />
    </RootDocument>
  ),
  // Prefetch session data during SSR
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(sessionQueryOptions())
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Carbonteq Starter",
        description: `Starter template for building web applications with Carbonteq.`,
      }),
    ],
    links: [
      // { rel: "stylesheet", href: styles },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
    ],
  }),
})
