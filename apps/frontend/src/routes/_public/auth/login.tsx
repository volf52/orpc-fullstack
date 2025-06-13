import LoginForm from "@app/components/auth/LoginForm"
import { createFileRoute } from "@tanstack/react-router"
import { type } from "arktype"

const LoginPage = () => {
  // https://tanstack.com/router/latest/docs/framework/react/guide/render-optimizations#fine-grained-selectors
  const redirectedTo = Route.useSearch({ select: (state) => state.redirect })

  console.debug("LoginPage search params:", redirectedTo)

  return <LoginForm />
}

export const Route = createFileRoute("/_public/auth/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Login to Carbonteq Starter" }] }),
  // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#using-search-params-in-loaders
  //
  validateSearch: type({ redirect: "string?" }), // adds type safety + validation
})
