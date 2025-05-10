"use client"

import { Container } from "@/styled-system/jsx"
import Loader from "../Loader"
import { useSession } from "@/utils/hooks/authHooks"

const GreetUser = () => {
  const { session, isPending } = useSession()
  const name = session?.data?.user.name || "Guest"

  if (isPending) {
    return <Loader fullHeight />
  }

  return (
    <Container fontSize="2xl" fontWeight="bold">
      Hello {name} 🐼!
    </Container>
  )
}

export default GreetUser
