"use client"

import { Container } from "@/styled-system/jsx"
import Loader from "../Loader"
import { useUser } from "@/utils/hooks/auth-hooks"

const GreetUser = () => {
  const { user, isPending } = useUser()
  const name = user?.name || "Guest"

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
