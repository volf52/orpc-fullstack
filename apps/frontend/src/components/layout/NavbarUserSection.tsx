import LogoutBtn from "@app/components/auth/LogoutBtn"
import NavLink from "@app/components/layout/NavLink"
import { useUser } from "@app/utils/hooks/auth-hooks"
import { Box } from "@styled/jsx"
import { Button } from "@ui/button"

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
        <NavLink to="/auth/login">
          <Button variant="ghost">Login</Button>
        </NavLink>
      </Box>
      <Box>
        <NavLink to="/auth/register">
          <Button variant="ghost">Register</Button>
        </NavLink>
      </Box>
    </>
  )
}

const NavbarUserSection = () => {
  const { data: user } = useUser()

  if (user) return <LoggedInRoutes />

  return <LoggedOutRoutes />
}

export default NavbarUserSection
