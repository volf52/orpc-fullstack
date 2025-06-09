import LoginForm from "@app/components/auth/LoginForm"
import { createFileRoute } from "@tanstack/react-router"

const LoginPage = () => {
  return <LoginForm />
}

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
})
