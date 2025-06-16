import RegisterForm from "@app/components/auth/RegisterForm"
import { createFileRoute } from "@tanstack/react-router"
import { useCallback } from "react"

const RegisterPage = () => {
  const navigate = Route.useNavigate()

  const onRegisterSuccess = useCallback(async () => {
    navigate({ to: "/auth/login", from: Route.path })
  }, [navigate])

  return <RegisterForm onRegisterSuccess={onRegisterSuccess} />
}

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
})
