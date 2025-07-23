import { Badge, Card, Group, Stack, Text } from "@mantine/core"
import { CheckCircle2, Circle, Package } from "lucide-react"

export type ItemDisplayData = Readonly<{
  id?: string
  name: string
  quantity: number
  notes?: string | null
  status?: "pending" | "bought"
}>

type ListItemDisplayProps = {
  item: ItemDisplayData
  mode?: "full" | "compact" | "edit"
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleStatus?: () => void
}

export const ListItemDisplay = ({
  item,
  mode = "full",
}: ListItemDisplayProps) => {
  const isCompleted = item.status === "bought"

  if (mode === "compact") {
    return (
      <Card p="sm" radius="md" withBorder>
        <Group align="flex-start" justify="space-between">
          <div style={{ flex: 1 }}>
            <Text
              fw={500}
              size="sm"
              style={{
                textDecoration: isCompleted ? "line-through" : "none",
                color: isCompleted ? "var(--mantine-color-gray-6)" : undefined,
              }}
            >
              {item.name}
            </Text>
            {item.notes && (
              <Text c="dimmed" size="xs">
                {item.notes}
              </Text>
            )}
          </div>

          <Group align="center" gap="xs">
            <Text c="dimmed" size="sm">
              {item.quantity}x
            </Text>
            <Text c={isCompleted ? "green" : "gray"} fw={500} size="xs">
              {item.status || "pending"}
            </Text>
          </Group>
        </Group>
      </Card>
    )
  }

  return (
    <Card p="sm" radius="md" withBorder>
      <Group align="flex-start" justify="space-between">
        <Group align="flex-start" gap="sm">
          {isCompleted ? (
            <CheckCircle2 color="var(--mantine-color-green-6)" size={20} />
          ) : (
            <Circle color="var(--mantine-color-gray-5)" size={20} />
          )}
          <div>
            <Text
              fw={500}
              style={{
                textDecoration: isCompleted ? "line-through" : "none",
                color: isCompleted ? "var(--mantine-color-gray-6)" : undefined,
              }}
            >
              {item.name}
            </Text>
            {item.notes && (
              <Text c="dimmed" size="sm">
                {item.notes}
              </Text>
            )}
          </div>
        </Group>

        <Group align="center" gap="xs">
          <Badge leftSection={<Package size={12} />} size="sm" variant="light">
            {item.quantity}
          </Badge>
          <Badge
            color={isCompleted ? "green" : "gray"}
            size="sm"
            variant="light"
          >
            {item.status || "pending"}
          </Badge>
        </Group>
      </Group>
    </Card>
  )
}

type ListItemListProps = {
  items: ItemDisplayData[]
  mode?: "full" | "compact"
  emptyMessage?: string
  showStats?: boolean
}

export const ListItemList = ({
  items,
  mode = "full",
  emptyMessage = "No items in this list",
}: ListItemListProps) => {
  if (items.length === 0) {
    return (
      <Text c="dimmed" py="xl" ta="center">
        {emptyMessage}
      </Text>
    )
  }

  return (
    <Stack gap="xs">
      {items.map((item, index) => (
        <ListItemDisplay
          item={item}
          key={item.id || `item-${index}`}
          mode={mode}
        />
      ))}
    </Stack>
  )
}
