import type { Omitt } from "@app/types"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import {
  NavigationMenuLink as Link,
  NavigationMenuItem,
  type NavigationMenuLinkProps as LinkProps,
  NavigationMenu,
} from "@ui/navigation"
import { forwardRef } from "react"

import { styled } from "@shadow-panda/styled-system/jsx"
import { link } from "@shadow-panda/styled-system/recipes"

type NavLinkProps = Omitt<LinkProps, "href"> & {
  noHover?: boolean
}

// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
const NavLinkBuilder = forwardRef<typeof Link, NavLinkProps>((props, ref) => {
  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <Link
          _hover={props.noHover ? { textDecoration: "none" } : undefined}
          // @ts-expect-error
          ref={ref}
          {...props}
        />
      </NavigationMenuItem>
    </NavigationMenu>
  )
})

const CreatedComponent = createLink(NavLinkBuilder)

const NavLink: LinkComponent<typeof CreatedComponent> = (props) => (
  <CreatedComponent preload="intent" {...props} />
)

export default NavLink
