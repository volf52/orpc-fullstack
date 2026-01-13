import { z } from 'zod'
import type { core } from 'zod/v4'

export type ExtendedSchema<
  Schema extends core.$ZodType,
  Methods extends Record<string, unknown>,
> = Schema & Methods

export const addMethodsToSchema = <
  Schema extends core.$ZodType,
  Methods extends Record<string, unknown>,
>(
  schema: Schema,
  methods: Methods,
): ExtendedSchema<Schema, Methods> => {
  const extended = schema as ExtendedSchema<Schema, Methods>

  for (const [key, value] of Object.entries(methods)) {
    // @ts-expect-error: intentional
    extended[key] = value
  }

  return extended
}

if (import.meta.main) {
  const extended = addMethodsToSchema(z.object({ name: z.string() }), {
    new: () => 'abc',
  })

  console.debug(extended.new()) // "abc"
  console.debug(extended.parse({ name: 'hello' })) // { name: "hello" }
}
