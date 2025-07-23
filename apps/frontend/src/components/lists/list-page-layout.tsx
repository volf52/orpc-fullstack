import type { Size, ValidAppLink } from "@app/types"
import { Button, Container, Group, Stack, Text } from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"

type ListPageLayoutProps = {
  children: ReactNode
  backTo: ValidAppLink
  backLabel: string
  size?: Size
  notFound?: {
    message: string
    backTo: ValidAppLink
    backLabel: string
  }
}

export const ListPageLayout = ({
  children,
  backTo,
  backLabel,
  size = "md",
  notFound,
}: ListPageLayoutProps) => {
  if (notFound) {
    return (
      <Container p="xl" pt="xl" size={size}>
        <Stack align="center" gap="md">
          <Text c="dimmed" size="lg">
            {notFound.message}
          </Text>
          <Button component={Link} to={notFound.backTo} variant="subtle">
            {notFound.backLabel}
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <Container p="xl" pt="xl" size={size}>
      <Stack gap="lg">
        <Group>
          <Button
            component={Link}
            leftSection={<ArrowLeft size={16} />}
            to={backTo}
            variant="subtle"
          >
            {backLabel}
          </Button>
        </Group>
        {children}
      </Stack>
    </Container>
  )
}
