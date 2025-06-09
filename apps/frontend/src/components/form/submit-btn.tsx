import { useFormContext } from "@app/utils/contexts/form-context"
import { Button } from "@ui/button"

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
          disabled={disabled || isSubmitting || !canSubmit}
          type="submit"
          width={fullWidth ? "full" : undefined}>
          {isSubmitting ? "Submitting..." : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export default SubmitButton
