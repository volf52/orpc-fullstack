import { Button, type ButtonProps, type ElementProps } from "@mantine/core"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import { forwardRef } from "react"

interface LinkBtnProps
  extends ButtonProps,
    ElementProps<"button", keyof ButtonProps> {}

// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
const LinkBtnBuilder = forwardRef<HTMLButtonElement, LinkBtnProps>(
  (props, ref) => {
    return <Button ref={ref} {...props} />
  },
)

const CreatedComponent = createLink(LinkBtnBuilder)

const LinkBtn: LinkComponent<typeof LinkBtnBuilder> = (props) => (
  <CreatedComponent preload="intent" {...props} />
)

export default LinkBtn
