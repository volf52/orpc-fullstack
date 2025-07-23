import { Button, Group } from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { Edit, Eye, Trash2 } from "lucide-react"

type ListActionButtonsProps = {
  listId: string
  isActive: boolean
  onToggleActive?: () => void
  onDelete: () => void
  isDeleting?: boolean
  editPath?: string
}

export const ListActionButtons = ({
  listId,
  isActive,
  onToggleActive,
  onDelete,
  isDeleting = false,
  editPath = `/lists/${listId}/edit`,
}: ListActionButtonsProps) => {
  return (
    <Group gap="xs">
      {onToggleActive && (
        <Button
          color={isActive ? "gray" : "blue"}
          leftSection={<Eye size={16} />}
          onClick={onToggleActive}
          variant="light"
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      )}
      <Button
        color="yellow"
        component={Link}
        leftSection={<Edit size={16} />}
        to={editPath}
        variant="light"
      >
        Edit
      </Button>
      <Button
        color="red"
        leftSection={<Trash2 size={16} />}
        loading={isDeleting}
        onClick={onDelete}
        variant="light"
      >
        Delete
      </Button>
    </Group>
  )
}
