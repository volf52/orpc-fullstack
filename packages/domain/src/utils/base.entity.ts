import { Schema as S } from "effect"
import { DateTime, UUID } from "./refined-types"

export const baseEntityFields = {
  id: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
} as const satisfies S.Struct.Fields
export type TBaseEntityFields = typeof baseEntityFields

const baseEntityStruct = S.mutable(S.Struct(baseEntityFields))

export const defineEntityStruct = <Fields extends S.Struct.Fields>(
  fields: Fields,
) =>
  S.asSchema(
    S.Struct({
      ...baseEntityFields,
      ...fields,
    }),
  )

export type BaseEntityEncoded = S.Schema.Encoded<typeof baseEntityStruct>
export type BaseEntityType = S.Schema.Type<typeof baseEntityStruct>

export class BaseEntity implements BaseEntityType {
  readonly id: BaseEntityType["id"]
  readonly createdAt: BaseEntityType["createdAt"]
  #updatedAt: BaseEntityType["updatedAt"]

  protected constructor(data: BaseEntityType) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.#updatedAt = data.updatedAt
  }

  get updatedAt() {
    return this.#updatedAt
  }

  protected markUpdatedAt() {
    this.#updatedAt = DateTime.now()
  }
}
