import { Button, type ButtonProps, type ElementProps } from "@mantine/core"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import { forwardRef } from "react"

interface LinkBtnProps
  extends ButtonProps,
    ElementProps<"button", keyof ButtonProps> {}

// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
const LinkBtnBuilder = forwardRef<typeof Button, LinkBtnProps>((props, ref) => {
  return (
    <Button
      // @ts-expect-error
      ref={ref}
      {...props}
    />
  )
})

const CreatedComponent = createLink(LinkBtnBuilder)

const LinkBtn: LinkComponent<typeof CreatedComponent> = (props) => (
  <CreatedComponent preload="intent" {...props} />
)

export default LinkBtn
