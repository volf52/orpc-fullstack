import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "@/utils/contexts/form-context"
import SubmitButton from "@/components/form/submit-btn"
import TextField from "@/components/form/text-field"

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
