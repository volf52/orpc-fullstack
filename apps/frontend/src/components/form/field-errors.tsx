import { FormMessage } from "@app/components/form"
import type { AnyFieldApi } from "@tanstack/react-form"

type FieldErrorsProps = {
  field: AnyFieldApi
}

const FieldErrors = ({ field }: FieldErrorsProps) => {
  if (!field.state.meta.isTouched || field.state.meta.isValid) return null

  if (!field.state.meta.errors || field.state.meta.errors.length === 0)
    return null

  return (
    <FormMessage color="destructive">
      {field.state.meta.errors.map((err: Error) => (
        <span key={err.message}>{err.message}</span>
      ))}
      {/* {field.state.meta.isValidating ? "Validating..." : null} */}
    </FormMessage>
  )
}

export default FieldErrors
