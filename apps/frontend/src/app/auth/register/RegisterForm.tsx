"use client"

import AuthCard from "@/components/AuthCard"
import { useAppForm } from "@/utils/hooks/app-form-hooks"
import { useORPC } from "@/utils/contexts/orpc-context"
import { toaster } from "@/utils/toast"
import { useMutation } from "@tanstack/react-query"
import { NewUserSchema } from "@repo/contract/schemas"
import { useSetUser } from "@/utils/hooks/auth-hooks"

// const formSchema = type({
//   name: "string > 4",
//   email: "string.email",
//   password: "string",
// })

const formSchema = NewUserSchema

const RegisterForm = () => {
  const setUser = useSetUser()
  const orpc = useORPC()

  const registerMutation = useMutation(
    orpc.public.auth.signup.mutationOptions({
      onSuccess: (user) => {
        setUser(user)
      },
      onError: (e) => {
        toaster.error({ title: e.name, description: e.message })
      },
    }),
  )

  const tform = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
      registerMutation.mutate(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        tform.handleSubmit()
      }}
    >
      <tform.AppForm>
        <AuthCard
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
              />
            )}
          </tform.AppField>
        </AuthCard>
      </tform.AppForm>
    </form>
  )
}

export default RegisterForm
