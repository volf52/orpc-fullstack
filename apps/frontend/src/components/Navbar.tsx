"use client"

import NavLink from "./NavLink"
import { Flex, Box } from "@/styled-system/jsx"
import LogoutBtn from "./LogoutBtn"
import { useAuth } from "@/utils/contexts/auth-context"

const LoggedInRoutes = () => {
  return (
    <>
      <LogoutBtn />
    </>
  )
}
const loggedOutRoutes = [
  { to: "/auth/login", label: "Login" },
  { to: "/auth/register", label: "Register" },
]
const LoggedOutRoutes = () => {
  return (
    <>
      {loggedOutRoutes.map((link) => (
        <Box key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </Box>
      ))}
    </>
  )
}

const Navbar = () => {
  const user = useAuth()

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py="2"
      boxShadow="md"
      boxShadowColor="gray.200"
      // position="sticky"
      top="0"
      backgroundColor="gray.7"
      borderRadius="md"
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        mx="4"
      >
        <Box>
          <NavLink to="/">Home</NavLink>
        </Box>
      </Flex>

      <Flex px="4" gap="4">
        {user ? <LoggedInRoutes /> : <LoggedOutRoutes />}
      </Flex>
    </Flex>
  )
}

export default Navbar
