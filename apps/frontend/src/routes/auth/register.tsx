import { createFileRoute } from "@tanstack/react-router"
import RegisterForm from "@/components/auth/RegisterForm"

const RegisterPage = () => {
  return <RegisterForm />
}

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
})
