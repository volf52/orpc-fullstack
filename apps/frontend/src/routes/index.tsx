import GreetUser from "@/components/home/GreetUser"
import { createFileRoute } from "@tanstack/react-router"

const Home = () => {
  return <GreetUser />
}

export const Route = createFileRoute("/")({
  component: Home,
})
