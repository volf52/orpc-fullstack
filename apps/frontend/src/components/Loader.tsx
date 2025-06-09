import { Flex } from "@styled/jsx"
import { Skeleton } from "@ui/skeleton"

export type LoaderProps = {
  size?: "sm" | "md" | "lg" | "xl"
  label?: string
  fullHeight?: boolean
}

const Loader = (props: LoaderProps) => {
  const label = props.label || "Loading..."
  const size = props.size || "xl"

  return (
    <Flex
      alignItems="center"
      height={props.fullHeight ? "100vh" : "100%"}
      justifyContent="center"
      width="100%">
      {/* <Spinner */}
      {/*   aria-label={label} */}
      {/*   color="accent" */}
      {/*   label={label} */}
      {/*   size={props.size || "xl"} */}
      {/* /> */}

      <Skeleton
        aria-label={label}
        color="accent"
        h={size}
        rounded="full"
        w={size}
      />
    </Flex>
  )
}

export default Loader
