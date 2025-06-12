import PasswordField from "@app/components/form/password-field"
import SubmitButton from "@app/components/form/submit-btn"
import TextField from "@app/components/form/text-field"
import { fieldContext, formContext } from "@app/utils/contexts/form-context"
import { createFormHook } from "@tanstack/react-form"

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
