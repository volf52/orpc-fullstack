import type { Omitt, Prettify } from "@app/types"
import { Anchor, type AnchorProps, type ElementProps } from "@mantine/core"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import { forwardRef } from "react"

// Need this for the polymorphic component to work correctly
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

const CreatedComponent = createLink(AnchorLinkBuilder)

const AnchorLink: LinkComponent<typeof AnchorLinkBuilder> = (props) => (
  <CreatedComponent preload="intent" {...props} />
)

export default AnchorLink
