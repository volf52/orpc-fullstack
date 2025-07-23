import { Button, Stack, Text } from "@mantine/core"
import { Link } from "@tanstack/react-router"

type ListNotFoundStateProps = {
  message?: string
  backTo?: string
  backLabel?: string
}

export const ListNotFoundState = ({
  message = "List not found",
  backTo = "/lists",
  backLabel = "Back to Lists",
}: ListNotFoundStateProps) => {
  return (
    <Stack align="center" gap="md">
      <Text c="dimmed" size="lg">
        {message}
      </Text>
      <Button component={Link} to={backTo} variant="subtle">
        {backLabel}
      </Button>
    </Stack>
  )
}
