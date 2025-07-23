import { Card, Stack, Title } from "@mantine/core"
import type { ReactNode } from "react"

type ListFormCardProps = {
  title?: ReactNode
  children: ReactNode
  padding?: string
}

export const ListFormCard = ({
  title,
  children,
  padding = "xl",
}: ListFormCardProps) => {
  return (
    <Card p={padding} radius="md" shadow="sm" withBorder>
      <Stack gap="md">
        {title && (
          <Title order={3} size="lg">
            {title}
          </Title>
        )}
        {children}
      </Stack>
    </Card>
  )
}
