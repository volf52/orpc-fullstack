import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import { Stack, type StackProps, VStack } from "@styled/jsx"
import { Container } from "@styled/jsx/container"

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
    <Container maxWidth={maxWidth} py={py}>
      <Card backdropBlur="lg" bg="white.a11" borderRadius="2xl" boxShadow="xl">
        <CardHeader>
          <VStack alignContent="center">
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </VStack>
        </CardHeader>

        <CardContent>
          <Stack gap={stackGap}>{children}</Stack>
        </CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </Container>
  )
}

export default CardLayout
