import CardLayout from "@app/components/layout/Card"
import { useAppForm } from "@app/utils/hooks/app-form-hooks"
import { useSignUp } from "@app/utils/hooks/auth-hooks"
import { NewUserSchema } from "@repo/contract/schemas"
import { useNavigate } from "@tanstack/react-router"
import { useToast } from "@ui/toast/use-toast"

const formSchema = NewUserSchema

const RegisterForm = () => {
  const navigateTo = useNavigate()
  const signUpHandler = useSignUp()
  const authPending = signUpHandler.isPending

  const { toast } = useToast()

  const tform = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      signUpHandler.mutate(
        { ...value },
        {
          onSuccess: () => {
            navigateTo({ to: "/", from: "/auth/register" })
            toast({ title: "Registration successful" })
          },
          onError: (err) => {
            console.error("Registration error:", err)
            toast({
              title: "Registration failed",
              description: err.message,
              variant: "destructive",
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
          footer={<tform.SubmitButton fullWidth label="Submit" />}
          title="Register">
          <tform.AppField name="name">
            {(field) => (
              <field.TextField
                disabled={authPending}
                label="Name"
                placeholder="Name..."
                required
                type="text"
              />
            )}
          </tform.AppField>

          <tform.AppField name="email">
            {(field) => (
              <field.TextField
                disabled={authPending}
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
                disabled={authPending}
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

export default RegisterForm
