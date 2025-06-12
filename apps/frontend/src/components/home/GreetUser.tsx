import { useUser } from "@app/utils/hooks/auth-hooks"
import { Container, Title } from "@mantine/core"

const GreetUser = () => {
  const { data: user } = useUser()
  const name = user?.name || "Guest"

  return (
    <Container mx="0.5">
      <Title order={2}>Hello {name} 🐼!</Title>
    </Container>
  )
}

export default GreetUser
