import CardLayout from "@app/components/layout/Card"
import { useAppForm } from "@app/utils/hooks/app-form-hooks"
import { useSignIn } from "@app/utils/hooks/auth-hooks"
import { useNavigate } from "@tanstack/react-router"
import { useToast } from "@ui/toast/use-toast"
import { type } from "arktype"

const formSchema = type({ email: "string.email", password: "string >= 8" })

const LoginForm = () => {
  const navigateTo = useNavigate()
  const signInHandler = useSignIn()
  const { toast } = useToast()

  const tform = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      await signInHandler.mutateAsync(
        { ...value },
        {
          onSuccess: () => {
            navigateTo({ to: "/", from: "/auth/login" })
            toast({
              variant: "default",
              description: "Login successful",
            })
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              description: err.message,
              title: "Login failed",
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
      }}>
      <tform.AppForm>
        <CardLayout
          footer={
            <tform.SubmitButton
              disabled={signInHandler.isPending}
              fullWidth
              label="Submit"
            />
          }
          title="Login">
          <tform.AppField name="email">
            {(field) => (
              <field.TextField
                disabled={signInHandler.isPending}
                label="Email"
                placeholder="Email..."
                required
                type="email"
              />
            )}
          </tform.AppField>

          <tform.AppField name="password">
            {(field) => (
              <field.TextField
                disabled={signInHandler.isPending}
                label="Password"
                placeholder="Password..."
                required
                type="password"
              />
            )}
          </tform.AppField>
        </CardLayout>
      </tform.AppForm>
    </form>
  )
}

export default LoginForm
