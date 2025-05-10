"use client"

import CardLayout from "@/components/layout/Card"
import { useAppForm } from "@/utils/hooks/app-form-hooks"
import { authClient } from "@/utils/auth-client"
import { type } from "arktype"
import { toaster } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { useSignIn } from "@/utils/hooks/authHooks"

const formSchema = type({ email: "string.email", password: "string >= 8" })

const LoginForm = () => {
  const router = useRouter()
  const { isPending } = authClient.useSession()
  const signInHandler = useSignIn()

  const tform = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      await signInHandler.mutateAsync(
        { ...value },
        {
          onSuccess: () => {
            router.push("/")
            toaster.success({ title: "Login successful" })
          },
          onError: (err) => {
            toaster.error({ title: "Login failed", description: err.message })
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
          title="Login"
          footer={
            <tform.SubmitButton label="Submit" fullWidth disabled={isPending} />
          }
        >
          <tform.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="Email..."
                type="email"
                required
                disabled={isPending}
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
                disabled={isPending}
              />
            )}
          </tform.AppField>
        </CardLayout>
      </tform.AppForm>
    </form>
  )
}

export default LoginForm
