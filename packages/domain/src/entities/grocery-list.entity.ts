import type { Result } from "@carbonteq/fp"
import { Result as R } from "@carbonteq/fp"
import { GroceryListOwnershipError } from "@domain/errors/grocery-list.errors"
import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { DateTime, UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"
import type { UserType } from "./user.entity"

export const GroceryListId = UUID.pipe(S.brand("GroceryListId"))
export const GroceryListSchema = defineEntityStruct({
  id: GroceryListId,
  name: S.String.pipe(S.minLength(1)),
  description: S.String,
  ownerId: UUID.pipe(S.brand("UserId")),
})

export const GroceryListCreateSchema = GroceryListSchema.pipe(
  S.pick("name", "description"),
)

export const GroceryListUpdateSchema = S.partialWith(
  GroceryListSchema.pipe(S.pick("name", "description")),
  { exact: true },
)

export type GroceryListType = S.Schema.Type<typeof GroceryListSchema>
export type GroceryListEncoded = S.Schema.Encoded<typeof GroceryListSchema>
export type GroceryListUpdateData = S.Schema.Type<
  typeof GroceryListUpdateSchema
>
export type GroceryListCreateData = S.Schema.Type<
  typeof GroceryListCreateSchema
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

  static create(
    data: GroceryListCreateData,
    owner: UserType,
  ): GroceryListEntity {
    const groceryListData: GroceryListType = {
      id: GroceryListId.make(UUID.new()),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      name: data.name,
      description: data.description,
      ownerId: owner.id,
    }

    return new GroceryListEntity(groceryListData)
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

  ensureIsOwner(
    userId: UserType["id"],
  ): Result<void, GroceryListOwnershipError> {
    if (!this.isOwner(userId)) {
      return R.Err(new GroceryListOwnershipError(this.id))
    }
    return R.Ok(undefined)
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
