"use client"

import CardLayout from "@/components/layout/Card"
import { useAppForm } from "@/utils/hooks/app-form-hooks"
import { toaster } from "@/utils/toast"
import { NewUserSchema } from "@repo/contract/schemas"
import { useNavigate } from "react-router"
import { useSignUp } from "@/utils/hooks/auth-hooks"

// const formSchema = type({
//   name: "string > 4",
//   email: "string.email",
//   password: "string",
// })

const formSchema = NewUserSchema

const RegisterForm = () => {
  const navigateTo = useNavigate()
  const signUpHandler = useSignUp()
  const authPending = signUpHandler.isPending

  const tform = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      await signUpHandler.mutateAsync(
        { ...value },
        {
          onSuccess: () => {
            navigateTo("/")
            toaster.success({ title: "Registration successful" })
          },
          onError: (err) => {
            toaster.error({
              title: "Registration failed",
              description: err.message,
            })
          },
        },
      )
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        tform.handleSubmit()
      }}
    >
      <tform.AppForm>
        <CardLayout
          title="Register"
          footer={<tform.SubmitButton label="Submit" fullWidth />}
        >
          <tform.AppField name="name">
            {(field) => (
              <field.TextField
                label="Name"
                placeholder="Name..."
                type="text"
                required
                disabled={authPending}
              />
            )}
          </tform.AppField>

          <tform.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="Email..."
                type="email"
                required
                disabled={authPending}
              />
            )}
          </tform.AppField>

          <tform.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                placeholder="Password..."
                type="password"
                required
                disabled={authPending}
              />
            )}
          </tform.AppField>
        </CardLayout>
      </tform.AppForm>
    </form>
  )
}

export default RegisterForm
