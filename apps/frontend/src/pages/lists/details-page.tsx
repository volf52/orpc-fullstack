import {
  ListActionButtons,
  ListItemList,
  ListPageLayout,
  ListStatsCard,
} from "@app/components/lists"
import { useDeleteListMutation, useList } from "@app/shared/hooks/lists-hooks"
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core"

type ListDetailsPageProps = {
  id: string
}

export const ListDetailsPage = ({ id }: ListDetailsPageProps) => {
  const { data: list } = useList(id)
  const deleteMut = useDeleteListMutation()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this list?")) return
    await deleteMut.mutateAsync({ params: { id } })
  }

  const displayItems = list.items

  return (
    <ListPageLayout
      backLabel="Back to Lists"
      backTo="/lists"
      notFound={
        !list
          ? {
              message: "List not found",
              backTo: "/lists",
              backLabel: "Back to Lists",
            }
          : undefined
      }
    >
      <Card p="xl" radius="md" shadow="sm" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <div>
              <Title mb="xs" order={2}>
                {list.name}
              </Title>
              <Group gap="xs">
                <Text c="dimmed" size="sm">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </Text>
              </Group>
            </div>
            <ListActionButtons
              isActive={list.active}
              isDeleting={deleteMut.isPending}
              listId={id}
              onDelete={handleDelete}
            />
          </Group>

          {list.description && (
            <div>
              <Text fw={500} mb="xs">
                Description
              </Text>
              <Text c="dimmed">{list.description}</Text>
            </div>
          )}

          <div>
            <Text fw={500} mb="xs">
              Details
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text c="dimmed" size="sm">
                  Last Updated:
                </Text>
                <Text size="sm">
                  {new Date(String(list.updatedAt)).toLocaleDateString()}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text c="dimmed" size="sm">
                  Status:
                </Text>
                <Badge
                  color={list.active ? "blue" : "gray"}
                  size="sm"
                  variant="light"
                >
                  {list.active ? "Active" : "Inactive"}
                </Badge>
              </Group>
            </Stack>
          </div>

          <ListStatsCard stats={list.stats} />
          <ListItemList items={displayItems} />
        </Stack>
      </Card>
    </ListPageLayout>
  )
}
