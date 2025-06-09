import type * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { css, cx } from "@shadow-panda/styled-system/css"
import { styled } from "@shadow-panda/styled-system/jsx"
import {
  formControl,
  formDescription,
  formItem,
  formLabel,
  formMessage,
} from "@shadow-panda/styled-system/recipes"
import { Label } from "@ui/label"
import { forwardRef } from "react"

type FormLabelProps = React.ComponentPropsWithoutRef<typeof Label> & {
  isInvalid?: boolean
}

const BaseFormLabel = forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ className, isInvalid, ...props }, ref) => {
  return (
    <Label
      className={cx(isInvalid && css({ color: "destructive" }), className)}
      ref={ref}
      {...props}
    />
  )
})
BaseFormLabel.displayName = "FormLabel"

type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot> & {
  isInvalid?: boolean
}

const BaseFormControl = forwardRef<
  React.ComponentRef<typeof Slot>,
  FormControlProps
>(({ isInvalid, ...props }, ref) => {
  return (
    <Slot
      // aria-describedby={
      //   !error
      //     ? `${formDescriptionId}`
      //     : `${formDescriptionId} ${formMessageId}`
      // }
      aria-invalid={isInvalid}
      // id={formItemId}
      ref={ref}
      {...props}
    />
  )
})
BaseFormControl.displayName = "FormControl"

export const FormLabel = styled(BaseFormLabel, formLabel)
export const FormDescription = styled("p", formDescription)
export const FormMessage = styled("div", formMessage)
export const FormItem = styled("div", formItem)
export const FormControl = styled(BaseFormControl, formControl)
