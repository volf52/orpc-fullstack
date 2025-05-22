export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Omitt<T, K extends keyof T> = Omit<T, K>
