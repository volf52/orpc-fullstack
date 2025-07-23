import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@tanstack/react-form"
import { CheckCircle2, Circle, Edit2, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export type ItemData = {
  id?: string
  name: string
  quantity: number
  notes?: string
  status?: "pending" | "bought"
}

type ItemFormProps = {
  initialData?: ItemData
  onSubmit: (item: ItemData) => void
  onCancel: () => void
  isEditing?: boolean
}

const ItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: ItemFormProps) => {
  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      quantity: initialData?.quantity || 1,
      notes: initialData?.notes || "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...initialData,
        ...value,
        notes: value.notes.trim() || undefined,
      })
    },
  })

  return (
    <Card p="sm" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Stack gap="sm">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Item name is required" : undefined,
            }}
          >
            {(field) => (
              <TextInput
                error={field.state.meta.errors.join(", ")}
                label="Item Name"
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Milk, Bread, Apples"
                required
                size="sm"
                value={field.state.value}
              />
            )}
          </form.Field>

          <form.Field
            name="quantity"
            validators={{
              onChange: ({ value }) =>
                value < 1 ? "Quantity must be at least 1" : undefined,
            }}
          >
            {(field) => (
              <NumberInput
                error={field.state.meta.errors.join(", ")}
                label="Quantity"
                min={1}
                onChange={(value) => field.handleChange(Number(value) || 1)}
                size="sm"
                value={field.state.value}
              />
            )}
          </form.Field>

          <form.Field name="notes">
            {(field) => (
              <Textarea
                label="Notes (optional)"
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Any additional notes..."
                rows={2}
                size="sm"
                value={field.state.value}
              />
            )}
          </form.Field>

          <Group gap="xs" justify="flex-end">
            <Button onClick={onCancel} size="sm" variant="subtle">
              Cancel
            </Button>
            <Button
              leftSection={isEditing ? <Edit2 size={14} /> : <Plus size={14} />}
              size="sm"
              type="submit"
            >
              {isEditing ? "Update" : "Add"} Item
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}

type ItemListProps = {
  items: ItemData[]
  onUpdateItem: (index: number, item: ItemData) => void
  onDeleteItem: (index: number) => void
  onToggleStatus?: (index: number) => void
  showStatus?: boolean
  editable?: boolean
}

const ItemList = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onToggleStatus,
  showStatus = false,
  editable = true,
}: ItemListProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  return (
    <Stack gap="xs">
      {items.map((item, index) => (
        <div key={item.id || `item-${index}`}>
          {editingIndex === index ? (
            <ItemForm
              initialData={item}
              isEditing
              onCancel={() => setEditingIndex(null)}
              onSubmit={(updatedItem) => {
                onUpdateItem(index, updatedItem)
                setEditingIndex(null)
              }}
            />
          ) : (
            <Card p="sm" radius="md" withBorder>
              <Group align="flex-start" justify="space-between">
                <Group align="flex-start" gap="sm">
                  {showStatus && onToggleStatus && (
                    <ActionIcon
                      color={item.status === "bought" ? "green" : "gray"}
                      onClick={() => onToggleStatus(index)}
                      size="sm"
                      variant="subtle"
                    >
                      {item.status === "bought" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                    </ActionIcon>
                  )}
                  <div style={{ flex: 1 }}>
                    <Text
                      fw={500}
                      size="sm"
                      style={{
                        textDecoration:
                          item.status === "bought" ? "line-through" : "none",
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
                </Group>

                <Group align="center" gap="xs">
                  <Badge size="sm" variant="light">
                    {item.quantity}x
                  </Badge>
                  {showStatus && (
                    <Badge
                      color={item.status === "bought" ? "green" : "gray"}
                      size="sm"
                      variant="light"
                    >
                      {item.status || "pending"}
                    </Badge>
                  )}
                  {editable && (
                    <Group gap={4}>
                      <ActionIcon
                        color="blue"
                        onClick={() => setEditingIndex(index)}
                        size="sm"
                        variant="subtle"
                      >
                        <Edit2 size={12} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => onDeleteItem(index)}
                        size="sm"
                        variant="subtle"
                      >
                        <Trash2 size={12} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>
              </Group>
            </Card>
          )}
        </div>
      ))}
    </Stack>
  )
}

type ItemManagerProps = {
  items: ItemData[]
  onItemsChange: (items: ItemData[]) => void
  showStatus?: boolean
  title?: string
}

export const ItemManager = ({
  items,
  onItemsChange,
  showStatus = false,
  title = "Items",
}: ItemManagerProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false)

  const handleAddItem = (newItem: ItemData) => {
    onItemsChange([
      ...items,
      { ...newItem, status: newItem.status || "pending" },
    ])
    setIsAddingItem(false)
  }

  const handleUpdateItem = (index: number, updatedItem: ItemData) => {
    const newItems = [...items]
    newItems[index] = updatedItem
    onItemsChange(newItems)
  }

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const handleToggleStatus = (index: number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      status: newItems[index].status === "bought" ? "pending" : "bought",
    }
    onItemsChange(newItems)
  }

  return (
    <Card p="lg" radius="md" shadow="sm" withBorder>
      <Stack gap="md">
        <Group align="center" justify="space-between">
          <Title order={3} size="lg">
            {title} ({items.length})
          </Title>
          {!isAddingItem && (
            <Button
              leftSection={<Plus size={14} />}
              onClick={() => setIsAddingItem(true)}
              size="sm"
              variant="light"
            >
              Add Item
            </Button>
          )}
        </Group>

        {isAddingItem && (
          <ItemForm
            onCancel={() => setIsAddingItem(false)}
            onSubmit={handleAddItem}
          />
        )}

        {items.length === 0 && !isAddingItem ? (
          <Text c="dimmed" py="xl" ta="center">
            No items added yet. Click "Add Item" to get started.
          </Text>
        ) : (
          <ItemList
            items={items}
            onDeleteItem={handleDeleteItem}
            onToggleStatus={showStatus ? handleToggleStatus : undefined}
            onUpdateItem={handleUpdateItem}
            showStatus={showStatus}
          />
        )}
      </Stack>
    </Card>
  )
}
