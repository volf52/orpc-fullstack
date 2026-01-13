import { z } from 'zod/v4'
import { DateTime, UUID } from './zod/refined-types'
import { addMethodsToSchema } from './zod/schema-utils'

export const baseEntityFields = {
  id: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
} as const satisfies z.core.$ZodShape
export type TBaseEntityFields = typeof baseEntityFields

const baseEntitySchema = z.object(baseEntityFields)

export const defineEntityStruct = <
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
  const extendedSchema = addMethodsToSchema(schema, {
    baseInit: () => ({
      id: id.new(),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }),
    id,
  })

  return extendedSchema
}

export type BaseEntityEncoded = z.input<typeof baseEntitySchema>
export type BaseEntityType = z.output<typeof baseEntitySchema>

export type BaseEntityData<
  Id = BaseEntityType['id'],
  CreatedAt = BaseEntityType['createdAt'],
  UpdatedAt = BaseEntityType['updatedAt'],
> = {
  id: Id
  createdAt: CreatedAt
  updatedAt: UpdatedAt
}

export class BaseEntity<
  Id = BaseEntityType['id'],
  CreatedAt = BaseEntityType['createdAt'],
  UpdatedAt = BaseEntityType['updatedAt'],
> implements BaseEntityData<Id, CreatedAt, UpdatedAt> {
  readonly id: Id
  readonly createdAt: CreatedAt
  readonly updatedAt: UpdatedAt

  protected constructor(data: BaseEntityData<Id, CreatedAt, UpdatedAt>) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
