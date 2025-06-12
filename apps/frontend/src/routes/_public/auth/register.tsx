import RegisterForm from "@app/components/auth/RegisterForm"
import { createFileRoute } from "@tanstack/react-router"

const RegisterPage = () => {
  return <RegisterForm />
}

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
})
