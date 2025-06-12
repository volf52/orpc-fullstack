import LogoutBtn from "@app/components/auth/LogoutBtn"
import AnchorLink from "@app/components/layout/AnchorLink"
import { AppShell, Box, Group, Stack, Text } from "@mantine/core"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

const PrivateLayout = () => {
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
            <LogoutBtn />
          </Box>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export const Route = createFileRoute("/_private")({
  component: PrivateLayout,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      console.warn("User not authenticated, redirecting to login")
      throw redirect({ to: "/auth/login" })
    }

    return { user: context.user } // to make user non-null
  },
})
