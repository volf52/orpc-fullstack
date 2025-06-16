import { Container, Flex, Title } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"

const Home = () => {
  const { user } = Route.useRouteContext()

  return (
    <Container h="100vh" p="xs" w="100%">
      <Flex align="center" justify="center">
        <Title order={2}>Hello {user.name} 🐼!</Title>
      </Flex>
    </Container>
  )
}

export const Route = createFileRoute("/_private/")({
  component: Home,
  head: () => ({ meta: [{ title: "Home" }] }),
})
