import { useAppForm } from "@app/utils/hooks/app-form-hooks"
import { useSignUp } from "@app/utils/hooks/auth-hooks"
import { toast } from "@app/utils/toast"
import { Container, Paper, Stack, Text, Title } from "@mantine/core"
import { NewUserSchema } from "@repo/contract/schemas"
import { useNavigate } from "@tanstack/react-router"
import AnchorLink from "../layout/AnchorLink"

const formSchema = NewUserSchema

const RegisterForm = () => {
  const navigateTo = useNavigate()
  const signUpHandler = useSignUp()
  const authPending = signUpHandler.isPending

  const tform = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      signUpHandler.mutate(
        { ...value },
        {
          onSuccess: () => {
            navigateTo({ to: "/", from: "/auth/register" })
            toast.success({ message: "Registration successful" })
          },
          onError: (err) => {
            console.error("Registration error:", err)
            toast.error({
              title: "Registration failed",
              message: err.message,
              variant: "destructive",
            })
          },
        },
      )
    },
  })

  return (
    <Container size="xs" my="xl">
      <Stack gap="md">
        <Title ta="center" order={2}>
          Create an account
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Already have an account?{" "}
          <AnchorLink to="/auth/login" size="sm">
            Sign in
          </AnchorLink>
        </Text>

        <Paper radius="md" p="xl" withBorder>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              tform.handleSubmit()
            }}>
            <tform.AppForm>
              <Stack gap="md">
                <tform.AppField name="name">
                  {(field) => (
                    <field.TextField
                      disabled={authPending}
                      label="Name"
                      placeholder="Your name"
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
                      placeholder="your@email.com"
                      required
                      type="email"
                    />
                  )}
                </tform.AppField>

                <tform.AppField name="password">
                  {(field) => (
                    <field.PasswordField
                      disabled={authPending}
                      label="Password"
                      placeholder="Your password"
                      required
                      type="password"
                    />
                  )}
                </tform.AppField>

                <tform.SubmitButton fullWidth label="Create account" />
              </Stack>
            </tform.AppForm>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default RegisterForm
