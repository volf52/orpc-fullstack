import LogoutBtn from "@app/components/auth/LogoutBtn"
import AnchorLink from "@app/components/layout/AnchorLink"
import { AppShell, Box, Group, Stack, Text } from "@mantine/core"
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router"
import { useCallback } from "react"

const PrivateLayout = () => {
  const router = useRouter()
  const navigate = Route.useNavigate()

  // test: Do we need the useCallback here?
  const handleLogout = useCallback(async () => {
    console.debug("User logged out, invalidating router state")
    router.invalidate().finally(() => {
      navigate({ to: "/auth/login" })
    })
  }, [navigate, router.invalidate])

  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }}>
      <AppShell.Navbar p="md">
        <Stack>
          <Box>
            <Group
              mb="md"
              pb="md"
              style={{
                borderBottom: "1px solid var(--mantine-color-dark-4)",
              }}>
              <AnchorLink to="/">
                <Text fw="bold" variant="text">
                  App
                </Text>
              </AnchorLink>
            </Group>

            <Stack gap="sm"></Stack>
          </Box>

          <Box
            mt="md"
            pt="md"
            style={{ borderTop: "1px solid var(--mantine-color-dark-4)" }}>
            <LogoutBtn onLogout={handleLogout} />
          </Box>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

// https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes#redirecting
export const Route = createFileRoute("/_private")({
  component: PrivateLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      console.warn("User not authenticated, redirecting to login")
      throw redirect({ to: "/auth/login", search: { redirect: location.href } })
    }

    return { user: context.user } // to make user non-null
  },
})
