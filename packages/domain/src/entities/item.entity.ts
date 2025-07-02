import type { UnitResult } from "@carbonteq/fp"
import { Result as R } from "@carbonteq/fp"
import {
  ItemListMismatchError,
  ItemOwnershipError,
} from "@domain/errors/item.errors"
import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"
import { GroceryListId, type GroceryListType } from "./grocery-list.entity"
import { UserIdSchema, type UserType } from "./user.entity"

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

  belongsToList(listId: GroceryListType["id"]): boolean {
    return this.listId === listId
  }

  isCreatedBy(userId: UserType["id"]): boolean {
    return this.createdBy === userId
  }

  ensureCanBeModifiedBy(
    userId: UserType["id"],
  ): UnitResult<ItemOwnershipError> {
    if (!this.isCreatedBy(userId)) {
      return R.Err(new ItemOwnershipError(this.id))
    }

    return R.UNIT_RESULT
  }

  ensureBelongsToList(
    listId: GroceryListType["id"],
  ): UnitResult<ItemListMismatchError> {
    if (!this.belongsToList(listId)) {
      return R.Err(new ItemListMismatchError(this.id, listId))
    }

    return R.UNIT_RESULT
  }

  canBeDeletedBy(userId: UserType["id"]): boolean {
    return this.isCreatedBy(userId)
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
