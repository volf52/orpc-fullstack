"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cx } from "@shadow-panda/styled-system/css"
import { styled } from "@shadow-panda/styled-system/jsx"
import { progress } from "@shadow-panda/styled-system/recipes"
import * as React from "react"

const BaseProgress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const styles = progress()

  return (
    <ProgressPrimitive.Root
      className={cx(styles.root, className)}
      ref={ref}
      {...props}>
      <ProgressPrimitive.Indicator
        className={styles.indicator}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
BaseProgress.displayName = ProgressPrimitive.Root.displayName

export const Progress = styled(BaseProgress)
