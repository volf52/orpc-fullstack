"use client"

import { Container } from "@/styled-system/jsx"
import { authClient } from "@/utils/auth-client"
import Loader from "../Loader"

const GreetUser = () => {
  const { data, isPending } = authClient.useSession()
  const name = data?.user?.name || "Anonymous"

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
