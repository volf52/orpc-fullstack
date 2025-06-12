import GreetUser from "@app/components/home/GreetUser"
import { sessionQueryOptions } from "@app/utils/hooks/auth-hooks"
import { Loader } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

const Home = () => {
  return (
    <Suspense fallback={<Loader />}>
      <GreetUser />
    </Suspense>
  )
}

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(sessionQueryOptions())
  },
  head: () => ({ meta: [{ title: "Home" }] }),
})
