import { useAppForm } from "@app/utils/hooks/app-form-hooks"
import { useSignIn } from "@app/utils/hooks/auth-hooks"
import { toast } from "@app/utils/toast"
import { Container, Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import AnchorLink from "../layout/AnchorLink"

const formSchema = type({ email: "string.email", password: "string >= 8" })

const LoginForm = () => {
  const navigateTo = useNavigate()
  const signInHandler = useSignIn()

  const tform = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      await signInHandler.mutateAsync(
        { ...value },
        {
          onSuccess: () => {
            navigateTo({ to: "/", from: "/auth/login" })
            toast.success({
              message: "Login successful",
            })
          },
          onError: (err) => {
            toast.error({
              message: err.message,
              title: "Login failed",
            })
          },
        },
      )
    },
  })

  return (
    <Container my="md" size="xs">
      <Stack gap="sm">
        <Title order={2} ta="center">
          Welcome Back!
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Don't have an account yet?{" "}
          <AnchorLink size="sm" to="/auth/register">
            Create account
          </AnchorLink>
        </Text>

        <Paper p="lg" radius="md" withBorder>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              tform.handleSubmit()
            }}>
            <tform.AppForm>
              <Stack gap="md">
                <tform.AppField name="email">
                  {(field) => (
                    <field.TextField
                      disabled={signInHandler.isPending}
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
                      disabled={signInHandler.isPending}
                      label="Password"
                      placeholder="Your password"
                      required
                      type="password"
                    />
                  )}
                </tform.AppField>

                <Group justify="space-between">
                  <AnchorLink size="sm" to="/auth/forgot-password">
                    Forgot password?
                  </AnchorLink>
                </Group>

                <tform.SubmitButton fullWidth label="Sign in" />
              </Stack>
            </tform.AppForm>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default LoginForm
