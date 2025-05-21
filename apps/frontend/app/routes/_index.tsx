import GreetUser from "app/components/home/GreetUser"
import type { Route } from "./+types/_index"

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Home page" }, { name: "description", content: "Welcome!" }]
}

export default function Home() {
  return <GreetUser />
}
