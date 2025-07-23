import type { MantineSize } from "@mantine/core"
import type { LinkComponentProps } from "@tanstack/react-router"

export type ValidAppLink = LinkComponentProps["to"]
export type Size = MantineSize

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Omitt<T, K extends keyof T> = Omit<T, K>
