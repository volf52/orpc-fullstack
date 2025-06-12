import { useFormContext } from "@app/utils/contexts/form-context"
import { Button } from "@mantine/core"

export interface SubmitButtonProps {
  label: string
  fullWidth?: boolean
  disabled?: boolean
}

const SubmitButton = ({ label, fullWidth, disabled }: SubmitButtonProps) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}>
      {({ canSubmit, isSubmitting }) => (
        <Button
          disabled={disabled || !canSubmit}
          fullWidth={fullWidth}
          loading={isSubmitting}
          mt="xl"
          radius="md"
          type="submit">
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export default SubmitButton
