import { Container, Title } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"

const Home = () => {
  const { user } = Route.useRouteContext()

  return (
    <Container mx="0.5">
      <Title order={2}>Hello {user.name} 🐼!</Title>
    </Container>
  )
}

export const Route = createFileRoute("/_private/")({
  component: Home,
  head: () => ({ meta: [{ title: "Home" }] }),
})
