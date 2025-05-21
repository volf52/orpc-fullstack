import { Spinner } from "@/components/ui/spinner"
import { Flex } from "@/styled-system/jsx"

export type LoaderProps = {
  size?: "sm" | "md" | "lg" | "xl"
  label?: string
  fullHeight?: boolean
}

const Loader = (props: LoaderProps) => {
  const label = props.label || "Loading..."

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height={props.fullHeight ? "100vh" : "100%"}
      width="100%"
    >
      <Spinner
        size={props.size || "xl"}
        color="accent"
        label={label}
        aria-label={label}
      />
    </Flex>
  )
}

export default Loader
