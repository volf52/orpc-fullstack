import NavLink from "./NavLink"
import { Flex } from "@/styled-system/jsx"
import NavbarUserSection from "./NavbarUserSection"
import { css } from "@/styled-system/css"
import { Heading } from "../ui/heading"

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
      })}
    >
      <Flex align="center" justify="space-between" maxW="7x1" mx="4">
        <Flex>
          <NavLink to="/">
            <Heading size="lg" color="colorPalette.text">
              CtStarter
            </Heading>
          </NavLink>
        </Flex>

        <Flex px="4" gap="4">
          <NavbarUserSection />
        </Flex>
      </Flex>
    </nav>
  )
}

export default Navbar
