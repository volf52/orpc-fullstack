import Heading from "@app/components/primitive/Heading"
import { css } from "@styled/css"
import { Flex } from "@styled/jsx"
import NavbarUserSection from "./NavbarUserSection"
import NavLink from "./NavLink"

const Navbar = () => {
  return (
    <nav
      className={css({
        width: "100%",
        bg: "colorPalette.canvas",
        boxShadow: "sm",
        py: "3",
        px: { base: "4", md: "8" },
        backdropFilter: "saturate(10) blur(10px)",
      })}>
      <Flex align="center" justify="space-between" maxW="7x1" mx="4">
        <Flex>
          <NavLink to="/">
            <Heading level="1">CtStarter</Heading>
          </NavLink>
        </Flex>

        <Flex gap="4" px="4">
          <NavbarUserSection />
        </Flex>
      </Flex>
    </nav>
  )
}

export default Navbar
