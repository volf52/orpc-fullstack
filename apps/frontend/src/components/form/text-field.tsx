import { FormControl, FormItem, FormLabel } from "@app/components/form"
import { useFieldContext } from "@app/utils/contexts/form-context"
import { Input } from "@ui/input"
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
  const isInvalid = !field.state.meta.isValid

  return (
    <FormItem>
      <FormLabel htmlFor={field.name} isInvalid={isInvalid}>
        {label}
      </FormLabel>
      <FormControl>
        <Input
          disabled={disabled}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={field.state.value}
        />
      </FormControl>
      <FieldErrors field={field} />
    </FormItem>
  )
}

export default TextField
