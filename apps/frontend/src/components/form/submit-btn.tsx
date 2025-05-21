import { useFormContext } from "@/utils/contexts/form-context"
import { Button } from "@/components/ui/button"

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
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button
          type="submit"
          width={fullWidth ? "full" : undefined}
          disabled={disabled || isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Submitting..." : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export default SubmitButton
