import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useFieldContext } from "@/utils/contexts/form-context"
import type { HTMLInputTypeAttribute } from "react"
import FieldErrors from "./field-errors"

export interface TextFieldProps {
  label: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  required?: boolean
  disabled?: boolean
}

const TextField = ({
  label,
  placeholder,
  type,
  required,
  disabled,
}: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field.Root invalid={!field.state.meta.isValid}>
      <Field.Label>{label}</Field.Label>
      <Field.Input asChild>
        <Input
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          required={required}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </Field.Input>
      <FieldErrors field={field} />
    </Field.Root>
  )
}

export default TextField
