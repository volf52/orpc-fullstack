/// <reference types="vite/client" />

import DefaultErrorBoundary from "@app/components/layout/DefaultErrorBoundary"
import NotFound from "@app/components/layout/NotFound"
import { authClient } from "@app/utils/auth-client"
import type { OrpcReactQuery } from "@app/utils/orpc"
import { seo } from "@app/utils/seo"
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Suspense } from "react"
import styles from "./styles.css?url"

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

const RootComponent = () => {
  return (
    <RootDocument>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
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
  beforeLoad: async () => {
    const session = await authClient.getSession()

    return { user: session.data?.user || null }
  },
  // Prefetch session data during SSR
  // loader: async ({ context: { queryClient } }) => {
  //   await queryClient.prefetchQuery(sessionQueryOptions())
  // },
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
      { rel: "stylesheet", href: styles },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
    ],
  }),
})
