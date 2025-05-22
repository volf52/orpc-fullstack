"use client"

import { useUser } from "@/utils/hooks/auth-hooks"
import { Box } from "@/styled-system/jsx"
import LogoutBtn from "@/components/auth/LogoutBtn"
import NavLink from "@/components/layout/NavLink"
import { Button } from "../ui/button"

const LoggedInRoutes = () => {
  return (
    <>
      <LogoutBtn />
    </>
  )
}

const LoggedOutRoutes = () => {
  return (
    <>
      <Box>
        <NavLink to="/auth/login" preload="intent">
          <Button variant="ghost">Login</Button>
        </NavLink>
      </Box>
      <Box>
        <NavLink to="/auth/register" preload="intent">
          <Button variant="ghost">Register</Button>
        </NavLink>
      </Box>
    </>
  )
}

const NavbarUserSection = () => {
  const { user } = useUser()

  if (user) return <LoggedInRoutes />

  return <LoggedOutRoutes />
}

export default NavbarUserSection
