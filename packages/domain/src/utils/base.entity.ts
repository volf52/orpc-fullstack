import { Schema as S } from "effect"
import { DateTime, UUID } from "./refined-types"

export const baseEntityFields = {
  id: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
} as const satisfies S.Struct.Fields
export type TBaseEntityFields = typeof baseEntityFields

const baseEntityStruct = S.mutable(S.Struct(baseEntityFields))

export const defineEntityStruct = <
  IdTag extends string,
  Fields extends S.Struct.Fields,
>(
  idTag: IdTag,
  fields: Fields,
) =>
  S.asSchema(
    S.Struct({
      ...baseEntityFields,
      id: baseEntityFields.id.pipe(S.brand(idTag)),
      ...fields,
    }),
  )

type BaseEntityEncoded = S.Schema.Encoded<typeof baseEntityStruct>
type BaseEntityType = S.Schema.Type<typeof baseEntityStruct>

export class BaseEntity implements BaseEntityType {
  #data: BaseEntityType

  protected constructor(data: BaseEntityType) {
    this.#data = data
  }

  get id() {
    return this.#data.id
  }

  get createdAt() {
    return this.#data.createdAt
  }

  get updatedAt() {
    return this.#data.updatedAt
  }

  protected markUpdatedAt() {
    this.#data.id = UUID.new()
    this.#data.updatedAt = DateTime.now()
  }
}
