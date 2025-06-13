import type { Omitt, Prettify } from "@app/types"
import { Anchor, type AnchorProps, type ElementProps } from "@mantine/core"
import { createLink } from "@tanstack/react-router"
import { forwardRef } from "react"

// Need this for the polymorphic component prop types to work correctly
interface AllAnchorProps
  extends AnchorProps,
    ElementProps<"a", keyof AnchorProps> {}

// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link#mantine-example
type MantineAnchorProps = Omitt<AllAnchorProps, "href">

type AnchorLinkProps = Prettify<
  MantineAnchorProps & {
    noHover?: boolean
  }
>

const AnchorLinkBuilder = forwardRef<HTMLAnchorElement, AnchorLinkProps>(
  (props, ref) => {
    return <Anchor ref={ref} {...props} />
  },
)

// const CreatedComponent = createLink(AnchorLinkBuilder)

// const AnchorLink: LinkComponent<typeof AnchorLinkBuilder> = (props) => {
//   return <CreatedComponent preload="intent" {...props} />
// }

const AnchorLink = createLink(AnchorLinkBuilder)

export default AnchorLink
