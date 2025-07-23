import { Group, Stack, Switch, Text, Textarea, TextInput } from "@mantine/core"

type ListBasicInfoFormProps = {
  nameField: {
    state: { value: string; meta: { errors: string[] } }
    handleChange: (value: string) => void
  }
  descriptionField: {
    state: { value: string }
    handleChange: (value: string) => void
  }
  activeField?: {
    state: { value: boolean }
    handleChange: (value: boolean) => void
  }
  disabled?: boolean
}

export const ListBasicInfoForm = ({
  nameField,
  descriptionField,
  activeField,
  disabled = false,
}: ListBasicInfoFormProps) => {
  return (
    <Stack gap="md">
      <TextInput
        disabled={disabled}
        error={nameField.state.meta.errors.join(", ")}
        label="List Name"
        onChange={(e) => nameField.handleChange(e.target.value)}
        placeholder="Enter list name"
        required
        value={nameField.state.value}
      />

      <Textarea
        disabled={disabled}
        label="Description"
        onChange={(e) => descriptionField.handleChange(e.target.value)}
        placeholder="Enter list description (optional)"
        rows={3}
        value={descriptionField.state.value}
      />

      {activeField && (
        <Group align="center" justify="space-between">
          <div>
            <Text fw={500}>Active Status</Text>
            <Text c="dimmed" size="sm">
              Active lists are visible in your main lists view
            </Text>
          </div>
          <Switch
            checked={activeField.state.value}
            disabled={disabled}
            onChange={(e) => activeField.handleChange(e.currentTarget.checked)}
            size="lg"
          />
        </Group>
      )}
    </Stack>
  )
}
