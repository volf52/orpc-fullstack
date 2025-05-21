import type { AnyFieldApi } from "@tanstack/react-form"
import { Field } from "@/components/ui/field"

type FieldErrorsProps = {
  field: AnyFieldApi
}

const FieldErrors = ({ field }: FieldErrorsProps) => {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <>
          {field.state.meta.errors.map((err: Error) => (
            <Field.ErrorText key={err.message}>{err.message}</Field.ErrorText>
          ))}
        </>
      ) : null}
      {/* {field.state.meta.isValidating ? "Validating..." : null} */}
    </>
  )
}

export default FieldErrors
