import { Container } from "@/styled-system/jsx/container"
import { Card } from "./ui/card"
import { Stack, VStack, type StackProps } from "@/styled-system/jsx"

type AuthCardProps = {
  title: string
  altTitle?: string
  footer?: React.ReactNode
  children: React.ReactNode
  gap?: StackProps["gap"]
}

const AuthCard = ({
  title,
  altTitle,
  gap,
  children,
  footer,
}: AuthCardProps) => {
  const stackGap = gap || "4"

  return (
    <Container py={{ base: "12", md: "16" }} maxWidth="md">
      <Card.Root>
        <Card.Header>
          <VStack alignContent="center">
            <Card.Title>{title}</Card.Title>
            {altTitle && <Card.Description>{altTitle}</Card.Description>}
          </VStack>
        </Card.Header>

        <Card.Body>
          <Stack gap={stackGap}>{children}</Stack>
        </Card.Body>

        {footer && <Card.Footer>{footer}</Card.Footer>}
      </Card.Root>
    </Container>
  )
}

export default AuthCard
