import { Center, Container } from "@mantine/core"

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container h="100vh" size="xs">
      <Center h="100%">{children}</Center>
    </Container>
  )
}

export default PublicLayout
