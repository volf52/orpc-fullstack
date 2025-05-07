"use client"

import AuthCard from "@/components/AuthCard"
import { useAppForm } from "@/utils/hooks/app-form-hooks"
import { useSetUser } from "@/utils/hooks/auth-hooks"
import { useORPC } from "@/utils/contexts/orpc-context"
import { CredentialsSchema } from "@repo/contract/schemas"
import { useMutation } from "@tanstack/react-query"

// const formSchema = type({ email: "string.email", password: "string >= 8" })
const formSchema = CredentialsSchema

const LoginForm = () => {
  const setUser = useSetUser()
  const orpc = useORPC()

  const loginMutation = useMutation(
    orpc.public.auth.signin.mutationOptions({
      onSuccess: ({ token, user }) => {
        setUser(user)
      },
    }),
  )

  const tform = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
      return loginMutation.mutateAsync(value)
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
          title="Login"
          footer={<tform.SubmitButton label="Submit" fullWidth />}
        >
          <tform.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="Email..."
                type="email"
                required
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
              />
            )}
          </tform.AppField>
        </AuthCard>
      </tform.AppForm>
    </form>
  )
}

export default LoginForm
