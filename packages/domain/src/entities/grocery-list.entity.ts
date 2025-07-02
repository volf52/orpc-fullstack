import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"

export const GroceryListId = UUID.pipe(S.brand("GroceryListId"))
export const GroceryListSchema = defineEntityStruct({
  id: GroceryListId,
  name: S.String.pipe(S.minLength(1)),
  description: S.String,
  ownerId: UUID.pipe(S.brand("UserId")),
})

export const GroceryListUpdateSchema = S.partialWith(
  GroceryListSchema.pipe(S.pick("name", "description")),
  { exact: true },
)

export type GroceryListType = S.Schema.Type<typeof GroceryListSchema>
export type GroceryListEncoded = S.Schema.Encoded<typeof GroceryListSchema>
export type GroceryListUpdateData = S.Schema.Type<
  typeof GroceryListUpdateSchema
>

const bridge = createEncoderDecoderBridge(GroceryListSchema)

export class GroceryListEntity extends BaseEntity implements GroceryListType {
  override readonly id: GroceryListType["id"]

  readonly name: string
  readonly description: GroceryListType["description"]
  readonly ownerId: GroceryListType["ownerId"]

  private constructor(data: GroceryListType) {
    super(data)
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.ownerId = data.ownerId
  }

  static from(data: GroceryListType): GroceryListEntity {
    return new GroceryListEntity(data)
  }

  static fromEncoded(data: GroceryListEncoded) {
    return bridge.deserialize(data)
  }

  isOwner(userId: string): boolean {
    return this.ownerId === userId
  }

  serialize() {
    return bridge.serialize({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
    })
  }
}
