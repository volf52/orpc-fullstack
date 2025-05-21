import { Container } from "@/styled-system/jsx/container"
import { Card } from "@/components/ui/card"
import { Stack, VStack, type StackProps } from "@/styled-system/jsx"

type CardLayoutProps = {
  title: string
  subtitle?: string
  footer?: React.ReactNode
  children: React.ReactNode
  gap?: StackProps["gap"]
  maxWidth?: string
  py?: { base: string; md: string }
}

const CardLayout = ({
  title,
  subtitle,
  gap,
  children,
  footer,
  maxWidth = "md",
  py = { base: "12", md: "16" },
}: CardLayoutProps) => {
  const stackGap = gap || "4"

  return (
    <Container py={py} maxWidth={maxWidth}>
      <Card.Root
        backdropBlur="lg"
        borderRadius="2xl"
        boxShadow="xl"
        bg="white.a11"
      >
        <Card.Header>
          <VStack alignContent="center">
            <Card.Title>{title}</Card.Title>
            {subtitle && <Card.Description>{subtitle}</Card.Description>}
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

export default CardLayout
