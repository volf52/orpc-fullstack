import { useFieldContext } from "@app/utils/contexts/form-context"
import { PasswordInput } from "@mantine/core"
import type { HTMLInputTypeAttribute } from "react"

export interface TextFieldProps {
  label: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  required?: boolean
  disabled?: boolean
}

const PasswordField = ({
  label,
  placeholder,
  type,
  required,
  disabled,
}: TextFieldProps) => {
  const field = useFieldContext<string>()
  const isInvalid = !field.state.meta.isValid
  const errMsg = field.state.meta.errors.join(", ")

  return (
    <PasswordInput
      aria-errormessage={errMsg}
      aria-invalid={isInvalid}
      disabled={disabled}
      error={errMsg}
      label={label}
      labelProps={{ mb: "xs" }}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      placeholder={placeholder}
      radius="md"
      required={required}
      type={type}
      value={field.state.value}
    />
  )
}

export default PasswordField
