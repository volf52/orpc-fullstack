import { Center, Loader } from "@mantine/core"

const FullPageLoader = () => {
  return (
    <Center h="100vh" w="100vw">
      <Loader size="xl" variant="dots" />
    </Center>
  )
}

export default FullPageLoader
