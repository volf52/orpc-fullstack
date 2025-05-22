import { createLink, type LinkComponent } from "@tanstack/react-router"
import { Link, type LinkProps } from "@/components/ui/link"
import type { Omitt } from "@/types"
import { forwardRef } from "react"

type NavLinkProps = Omitt<LinkProps, "href"> & {
  noHover?: boolean
}

const NavLinkBuilder = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => {
    return (
      <Link
        ref={ref}
        _hover={props.noHover ? { textDecoration: "none" } : undefined}
        {...props}
      />
    )
  },
)

const CreatedComponent = createLink(NavLinkBuilder)

const NavLink: LinkComponent<typeof CreatedComponent> = (props) => (
  <CreatedComponent {...props} />
)

export default NavLink
