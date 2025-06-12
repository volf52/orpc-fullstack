import { Button, Container, Group, Stack } from "@mantine/core"
import type { ErrorComponentProps } from "@tanstack/react-router"
import {
  ErrorComponent,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"
import LinkBtn from "./LinkBtn"

const DefaultErrorBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  return (
    <Container
      display="flex"
      mih="50vh"
      size="sm"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Stack align="center" gap="xl">
        <ErrorComponent error={error} />

        <Group gap="sm" wrap="wrap">
          <Button
            fw="bold"
            onClick={() => {
              router.invalidate()
            }}
            tt="uppercase"
            variant="light">
            Try Again
          </Button>

          {isRoot ? (
            <LinkBtn fw="bold" to="/" tt="uppercase" variant="light">
              Home
            </LinkBtn>
          ) : (
            <LinkBtn
              fw="bold"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
              to="/"
              tt="uppercase"
              variant="light">
              Go Back
            </LinkBtn>
          )}
        </Group>
      </Stack>
    </Container>
  )
}

export default DefaultErrorBoundary
