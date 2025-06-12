import { Center, Container } from "@mantine/core"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

const PublicLayout = () => {
  return (
    <Container h="100vh" size="xs">
      <Center h="100%">
        <Outlet />
      </Center>
    </Container>
  )
}

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
  beforeLoad: ({ context }) => {
    if (context.user) {
      console.warn("User is already authenticated, redirecting to home page.")
      throw redirect({ to: "/" })
    }

    return { user: null } // ensure user cannot be accessed in public routes
  },
})
