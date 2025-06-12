import { useSession } from "@app/utils/hooks/auth-hooks"
import { AppShell, Box, Code, Group, Stack } from "@mantine/core"
import { useNavigate } from "@tanstack/react-router"
import LogoutBtn from "../auth/LogoutBtn"
import AnchorLink from "./AnchorLink"

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const navigate = useNavigate()

  if (!session) {
    navigate({ to: "/auth/login" })
    return null
  }

  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }} padding="md">
      <AppShell.Navbar p="md">
        <Stack h="100%" justify="space-between">
          <Box>
            <Group
              mb="md"
              pb="md"
              style={{ borderBottom: "1px solid var(--mantine-color-dark-4)" }}>
              <AnchorLink to="/">
                <Code fw="bold">v3.1.2</Code>
              </AnchorLink>
            </Group>

            {/* Example navigation links - uncomment and convert to AnchorLink as needed */}
            {/* <Stack gap="xs">
              <AnchorLink to="/dashboard">
                <UnstyledButton className={classes.link}>
                  <IconDashboard className={classes.linkIcon} stroke={1.5} />
                  <span>Dashboard</span>
                </UnstyledButton>
              </AnchorLink>
              <AnchorLink to="/projects">
                <UnstyledButton className={classes.link}>
                  <IconFolder className={classes.linkIcon} stroke={1.5} />
                  <span>Projects</span>
                </UnstyledButton>
              </AnchorLink>
              <AnchorLink to="/settings">
                <UnstyledButton className={classes.link}>
                  <IconSettings className={classes.linkIcon} stroke={1.5} />
                  <span>Settings</span>
                </UnstyledButton>
              </AnchorLink>
            </Stack> */}
          </Box>

          <Box
            mt="md"
            pt="md"
            style={{ borderTop: "1px solid var(--mantine-color-dark-4)" }}>
            <LogoutBtn />
          </Box>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

export default PrivateLayout
