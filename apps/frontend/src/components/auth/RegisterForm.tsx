import { authClient } from "@app/utils/auth-client"
import { setOnSubmitErrorMap } from "@app/utils/form"
import { useAppForm } from "@app/utils/hooks/app-form"
import { toast } from "@app/utils/toast"
import { Card, Divider, Stack, Text, Title } from "@mantine/core"
import { type } from "arktype"
import AnchorLink from "../layout/AnchorLink"

// const formSchema = NewUserSchema
const formSchema = type({
  name: "string >= 1",
  email: "string.email",
  password: "string >= 3",
})

type RegisterFormProps = {
  onRegisterSuccess: () => Promise<void>
}

const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value, formApi }) => {
      const res = await authClient.signUp.email({ ...value })

      if (res.error) {
        toast.error({
          message: res.error.message,
          title: res.error.code,
        })
        setOnSubmitErrorMap(res.error, formApi)
      } else {
        toast.success({ message: "Registration successful" })
        await onRegisterSuccess()
      }
    },
  })
  const authPending = form.state.isSubmitting

  return (
    <Card miw="65%" p="lg" radius="lg" shadow="md" withBorder>
      <Card.Section inheritPadding py="lg">
        <Stack align="center" gap="xs">
          <Title order={2}>Create an account</Title>
          <Text c="dimmed" size="sm">
            Already have an account?{" "}
            <AnchorLink preload="intent" size="sm" to="/auth/login">
              Sign in
            </AnchorLink>
          </Text>
        </Stack>
      </Card.Section>
      <Divider />
      <Card.Section
        component="form"
        inheritPadding
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        py="xs"
      >
        <form.AppForm>
          <Stack gap="md">
            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  disabled={authPending}
                  label="Name"
                  placeholder="Your name"
                  required
                  type="text"
                />
              )}
            </form.AppField>
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  disabled={authPending}
                  label="Email"
                  placeholder="your@email.com"
                  required
                  type="email"
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.PasswordField
                  disabled={authPending}
                  label="Password"
                  placeholder="Your password"
                  required
                  type="password"
                />
              )}
            </form.AppField>
          </Stack>
          <Divider my="md" />
          <form.SubmitButton fullWidth label="Create account" />
        </form.AppForm>
      </Card.Section>
    </Card>
  )
}

export default RegisterForm
