import LogoutBtn from "@app/components/auth/LogoutBtn"
import { useUser } from "@app/utils/hooks/auth-hooks"
import { Box } from "@mantine/core"
import LinkBtn from "./LinkBtn"

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
        <LinkBtn fullWidth to="/auth/login" variant="light">
          Login
        </LinkBtn>
      </Box>
      <Box>
        <LinkBtn fullWidth to="/auth/register" variant="light">
          Register
        </LinkBtn>
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
