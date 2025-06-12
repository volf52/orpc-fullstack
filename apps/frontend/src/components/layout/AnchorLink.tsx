import type { Omitt, Prettify } from "@app/types"
import {
  type ElementProps,
  Anchor as Link,
  type AnchorProps as LinkProps,
} from "@mantine/core"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import { forwardRef } from "react"

interface AllAnchorLinkProps
  extends LinkProps,
    ElementProps<"a", keyof LinkProps> {}

type AnchorLinkProps = Prettify<
  Omitt<AllAnchorLinkProps, "href"> & {
    noHover?: boolean
  }
>

// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
const NavLinkBuilder = forwardRef<typeof Link, AnchorLinkProps>(
  (props, ref) => {
    return (
      <Link
        _hover={props.noHover ? { textDecoration: "none" } : undefined}
        // @ts-expect-error
        ref={ref}
        {...props}
      />
    )
  },
)

const CreatedComponent = createLink(NavLinkBuilder)

const AnchorLink: LinkComponent<typeof CreatedComponent> = (props) => (
  <CreatedComponent preload="intent" {...props} />
)

export default AnchorLink
