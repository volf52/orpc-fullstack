import NavLink from "./NavLink"
import { Flex, Box } from "@/styled-system/jsx"
import NavbarUserSection from "./NavbarUserSection"

const Navbar = () => {
  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py="2"
      boxShadow="md"
      boxShadowColor="gray.200"
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
        <NavbarUserSection />
      </Flex>
    </Flex>
  )
}

export default Navbar
