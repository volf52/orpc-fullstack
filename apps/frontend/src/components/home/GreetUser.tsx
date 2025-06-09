import Heading from "@app/components/primitive/Heading"
import { useUser } from "@app/utils/hooks/auth-hooks"
import { Container } from "@styled/jsx"
import Loader from "../Loader"

const GreetUser = () => {
  const { data: user, isPending } = useUser()
  const name = user?.name || "Guest"

  if (isPending) {
    return <Loader fullHeight />
  }

  return (
    <Container mx="0.5">
      <Heading level="2">Hello {name} 🐼!</Heading>
    </Container>
  )
}

export default GreetUser
