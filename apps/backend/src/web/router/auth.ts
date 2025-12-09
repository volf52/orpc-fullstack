import Elysia from "elysia"
import type { DependencyContainer } from "tsyringe"
import { resolveAuthFromContainer } from "@/infra/auth/better-auth"

export const getElysiaAuthRouter = (container: DependencyContainer) => {
  const auth = resolveAuthFromContainer(container)

  return new Elysia({
    name: "better-auth",
    prefix: "/auth",
  }).mount(auth.handler)
}
