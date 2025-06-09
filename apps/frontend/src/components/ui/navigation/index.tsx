"use client"

import type {
  NavigationMenuIndicatorProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuViewportProps,
} from "@radix-ui/react-navigation-menu"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { createStyleContext } from "@shadow-panda/style-context"
import { cx } from "@shadow-panda/styled-system/css"
import { styled } from "@shadow-panda/styled-system/jsx"
import { navigationMenu } from "@shadow-panda/styled-system/recipes"
import { ChevronDown } from "lucide-react"
import * as React from "react"

const { withProvider, withContext } = createStyleContext(navigationMenu)

const BaseNavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root ref={ref} {...props}>
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
BaseNavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const BaseNavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} {...props}>
    {children} <ChevronDown aria-hidden="true" />
  </NavigationMenuPrimitive.Trigger>
))
BaseNavigationMenuTrigger.displayName =
  NavigationMenuPrimitive.Trigger.displayName

const ViewportWrapper = withContext(styled("div"), "viewportWrapper")

const BaseNavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ViewportWrapper>
    <NavigationMenuPrimitive.Viewport
      className={cx(className)}
      ref={ref}
      {...props}
    />
  </ViewportWrapper>
))
BaseNavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

export const NavigationMenu = withProvider(styled(BaseNavigationMenu), "root")
export const NavigationMenuList = withContext(
  styled(NavigationMenuPrimitive.List),
  "list",
)
export const NavigationMenuItem = withContext(
  styled(NavigationMenuPrimitive.Item),
  "item",
)
export const NavigationMenuTrigger = withContext(
  styled(BaseNavigationMenuTrigger),
  "trigger",
)
export const NavigationMenuContent = withContext(
  styled(NavigationMenuPrimitive.Content),
  "content",
)
export const NavigationMenuLink = withContext(
  styled(NavigationMenuPrimitive.Link),
  "link",
)
export const NavigationMenuViewport = withContext(
  styled(BaseNavigationMenuViewport),
  "viewport",
)
export const NavigationMenuIndicator = withContext(
  styled(NavigationMenuPrimitive.Indicator),
  "indicator",
  { children: <div /> },
)

export type {
  NavigationMenuLinkProps,
  NavigationMenuViewportProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuIndicatorProps,
}
