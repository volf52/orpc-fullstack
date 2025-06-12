import { Box, Container, Group, Text, Title } from "@mantine/core"
import LinkBtn from "./LinkBtn"

const NotFound = () => {
  return (
    <Container py="md">
      <Box pos="relative">
        <Box pos="relative" pt="lg">
          <Title fw="bolder" fz="h1" ta="center">
            Nothing to see here
          </Title>
          <Text c="dimmed" m="md" my="xl" size="lg" ta="center">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Group justify="center">
            <LinkBtn size="md" to="/">
              Take me back to home page
            </LinkBtn>
          </Group>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFound
