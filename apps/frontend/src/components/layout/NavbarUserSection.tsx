"use client"

import { useUser } from "@/utils/hooks/auth-hooks"
import { Box } from "@/styled-system/jsx"
import LogoutBtn from "@/components/auth/LogoutBtn"
import NavLink from "@/components/layout/NavLink"

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

const NavbarUserSection = () => {
  const { user } = useUser()

  if (user) return <LoggedInRoutes />

  return <LoggedOutRoutes />
}

export default NavbarUserSection
