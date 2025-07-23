import { useNewListMutation } from "@app/shared/hooks/lists-hooks"
import {
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import {
  type ItemData,
  ItemManager,
  ListPageLayout,
} from "../../components/lists"

export const NewListPage = () => {
  const newListMut = useNewListMutation()

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      items: [] as ItemData[],
    },
    onSubmit: async ({ value }) => {
      // Transform items to match backend expectation
      const transformedItems = value.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        notes: item.notes || "",
      }))

      await newListMut.mutateAsync({
        name: value.name,
        description: value.description,
        items: transformedItems,
      })
    },
  })

  const isSubmitting = form.state.isSubmitting

  return (
    <ListPageLayout backLabel="Back to Lists" backTo="/lists" size="sm">
      <Card p="xl" radius="md" shadow="sm" withBorder>
        <Card.Section inheritPadding py="lg">
          <Stack align="center" gap="xs">
            <Title order={2}>Create New Grocery List</Title>
            <Text c="dimmed" size="sm">
              Create a new list and add items to organize your groceries
            </Text>
          </Stack>
        </Card.Section>

        <Divider />

        <Card.Section
          component="form"
          inheritPadding
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          py="lg"
        >
          <Stack gap="lg">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  value.length < 2
                    ? "Name must be at least 2 characters"
                    : undefined,
              }}
            >
              {(field) => (
                <TextInput
                  disabled={isSubmitting}
                  error={field.state.meta.errors.join(", ")}
                  label="List Name"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Weekly Groceries"
                  required
                  value={field.state.value}
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Textarea
                  disabled={isSubmitting}
                  label="Description"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Optional description for this list..."
                  rows={4}
                  value={field.state.value}
                />
              )}
            </form.Field>

            <form.Field name="items">
              {(field) => (
                <ItemManager
                  items={field.state.value}
                  onItemsChange={(items: ItemData[]) =>
                    field.handleChange(items)
                  }
                  title="List Items"
                />
              )}
            </form.Field>

            <Divider my="md" />

            <Group justify="flex-end">
              <Button
                component={Link}
                disabled={isSubmitting}
                to="/lists"
                variant="subtle"
              >
                Cancel
              </Button>
              <Button loading={isSubmitting} type="submit">
                Create List
              </Button>
            </Group>
          </Stack>
        </Card.Section>
      </Card>
    </ListPageLayout>
  )
}
