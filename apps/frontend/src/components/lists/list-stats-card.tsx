import { Badge, Card, Group, Progress, Stack, Text } from "@mantine/core"
import type { ReactNode } from "react"

type ListStatsData = {
  totalItems: number
  completedItems: number
  pendingItems: number
  completionPercentage: number
}

type ListStatsCardProps = {
  stats: ListStatsData
  title?: ReactNode
}

export const ListStatsCard = ({
  stats,
  title = `Items (${stats.totalItems})`,
}: ListStatsCardProps) => {
  return (
    <Card bg="gray.0" p="md" radius="md" withBorder>
      <Stack gap="md">
        <Group align="center" justify="space-between">
          <Text fw={500} size="lg">
            {title}
          </Text>
          <Badge color="blue" variant="light">
            {stats.completedItems}/{stats.totalItems} completed
          </Badge>
        </Group>

        {stats.totalItems > 0 && (
          <Progress
            bg="gray.2"
            color="green"
            radius="xl"
            size="sm"
            value={stats.completionPercentage}
          />
        )}
      </Stack>
    </Card>
  )
}
