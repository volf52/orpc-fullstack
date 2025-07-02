import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"
import { GroceryListId } from "./grocery-list.entity"
import { UserIdSchema } from "./user.entity"

export const ItemStatusSchema = S.Literal("pending", "bought")

export const ItemSchema = defineEntityStruct({
  id: UUID.pipe(S.brand("ItemId")),
  listId: GroceryListId,
  name: S.String.pipe(S.minLength(1)),
  quantity: S.Number.pipe(S.positive()),
  status: ItemStatusSchema,
  createdBy: UserIdSchema,
})

export type ItemType = S.Schema.Type<typeof ItemSchema>
export type ItemEncoded = S.Schema.Encoded<typeof ItemSchema>
export type ItemStatus = S.Schema.Type<typeof ItemStatusSchema>

const bridge = createEncoderDecoderBridge(ItemSchema)

export class ItemEntity extends BaseEntity implements ItemType {
  override readonly id: ItemType["id"]

  readonly listId: ItemType["listId"]
  readonly name: string
  readonly quantity: number
  readonly status: ItemStatus
  readonly createdBy: ItemType["createdBy"]

  private constructor(data: ItemType) {
    super(data)
    this.id = data.id
    this.listId = data.listId
    this.name = data.name
    this.quantity = data.quantity
    this.status = data.status
    this.createdBy = data.createdBy
  }

  static from(data: ItemType): ItemEntity {
    return new ItemEntity(data)
  }

  static fromEncoded(data: ItemEncoded) {
    return bridge.deserialize(data)
  }

  isPending(): boolean {
    return this.status === "pending"
  }

  isBought(): boolean {
    return this.status === "bought"
  }

  belongsToList(listId: string): boolean {
    return this.listId === listId
  }

  isCreatedBy(userId: string): boolean {
    return this.createdBy === userId
  }

  serialize() {
    return bridge.serialize({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      listId: this.listId,
      name: this.name,
      quantity: this.quantity,
      status: this.status,
      createdBy: this.createdBy,
    })
  }
}
