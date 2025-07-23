import { useList, useUpdateListMutation } from "@app/shared/hooks/lists-hooks"
import {
  Button,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { Save } from "lucide-react"
import {
  type ItemData,
  ListFormCard,
  ListPageLayout,
} from "../../components/lists"

type ListUpdatePageProps = {
  id: string
}

export const ListUpdatePage = ({ id }: ListUpdatePageProps) => {
  const { data: list } = useList(id)
  const updateMutation = useUpdateListMutation()
  const navigate = useNavigate({ from: "/lists/$id/edit" })

  const displayItems: ItemData[] =
    list?.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes || undefined,
      status: item.status,
    })) || []

  const form = useForm({
    defaultValues: {
      name: list?.name || "",
      description: list?.description || "",
      active: list?.active ?? true,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        params: { id },
        body: {
          name: value.name.trim(),
          description: value.description.trim() || undefined,
          active: value.active,
        },
      })

      await navigate({ to: `/lists/${id}` })
    },
  })

  return (
    <ListPageLayout
      backLabel="Back to List"
      backTo={`/lists/${id}`}
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
      <Title order={2}>Edit List</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Stack gap="lg">
          <ListFormCard title="List Information">
            <Stack gap="md">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Name is required" : undefined,
                }}
              >
                {(field) => (
                  <TextInput
                    error={field.state.meta.errors.join(", ")}
                    label="List Name"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter list name"
                    required
                    value={field.state.value}
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Textarea
                    label="Description"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter list description (optional)"
                    rows={3}
                    value={field.state.value}
                  />
                )}
              </form.Field>

              <Group align="center" justify="space-between">
                <div>
                  <Text fw={500}>Active Status</Text>
                  <Text c="dimmed" size="sm">
                    Active lists are visible in your main lists view
                  </Text>
                </div>
                <form.Field name="active">
                  {(field) => (
                    <Switch
                      checked={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.currentTarget.checked)
                      }
                      size="lg"
                    />
                  )}
                </form.Field>
              </Group>
            </Stack>
          </ListFormCard>

          <ListFormCard
            padding="lg"
            title={
              <Group align="center" justify="space-between">
                <Title order={3} size="lg">
                  Items ({displayItems.length})
                </Title>
                <Text c="amber" fw={500} size="sm">
                  View Only
                </Text>
              </Group>
            }
          >
            <Text c="dimmed" size="sm">
              Item editing requires additional backend API endpoints. You can
              view existing items below, but modifications must be done by
              creating a new list.
            </Text>

            {displayItems.length === 0 ? (
              <Text c="dimmed" py="xl" ta="center">
                No items in this list.
              </Text>
            ) : (
              <Stack gap="xs">
                {displayItems.map((item, index) => (
                  <div
                    key={item.id || `item-${index}`}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid var(--mantine-color-gray-3)",
                      borderRadius: "8px",
                      backgroundColor: "var(--mantine-color-gray-0)",
                    }}
                  >
                    <Group align="flex-start" justify="space-between">
                      <div style={{ flex: 1 }}>
                        <Text
                          fw={500}
                          size="sm"
                          style={{
                            textDecoration:
                              item.status === "bought"
                                ? "line-through"
                                : "none",
                            color:
                              item.status === "bought"
                                ? "var(--mantine-color-gray-6)"
                                : undefined,
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
                        <Text
                          c={item.status === "bought" ? "green" : "gray"}
                          fw={500}
                          size="xs"
                        >
                          {item.status || "pending"}
                        </Text>
                      </Group>
                    </Group>
                  </div>
                ))}
              </Stack>
            )}

            <Text c="blue" size="xs" ta="center">
              To modify items, create a new list or visit the list details page
              to view stats and completion progress.
            </Text>
          </ListFormCard>

          <Group justify="space-between">
            <Button component={Link} to={`/lists/${id}`} variant="subtle">
              Cancel
            </Button>
            <Button
              leftSection={<Save size={16} />}
              loading={updateMutation.isPending}
              type="submit"
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </ListPageLayout>
  )
}
