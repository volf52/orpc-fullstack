"use client"

import { Container } from "@/styled-system/jsx"
import Loader from "../Loader"
import { useUser } from "@/utils/hooks/auth-hooks"
import { Heading } from "@/components/ui/heading"

const GreetUser = () => {
  const { user, isPending } = useUser()
  const name = user?.name || "Guest"

  if (isPending) {
    return <Loader fullHeight />
  }

  return (
    <Container mx="0.5">
      <Heading as="h2" fontSize="2xl">
        Hello {name} 🐼!
      </Heading>
    </Container>
  )
}

export default GreetUser
