import { z } from 'zod/v4'
import { DateTime, UUID } from './refined-types'
import { addMethodsToSchema } from './schema-utils'

export const baseEntityFields = {
  id: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
} as const satisfies z.core.$ZodShape

export type BaseEntityFields = typeof baseEntityFields

export const defineEntitySchema = <
  Tag extends string,
  Fields extends z.core.$ZodShape,
>(
  tag: Tag,
  fields: Fields,
) => {
  const id = UUID.extend(tag)

  const schema = z.object({
    ...baseEntityFields,
    id,
    ...fields,
  })

  return addMethodsToSchema(schema, {
    baseInit: () => ({
      id: id.new(),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }),
    id,
  })
}
