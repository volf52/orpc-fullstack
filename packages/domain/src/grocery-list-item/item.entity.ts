import type { Result } from '@carbonteq/fp'
import { Result as R } from '@carbonteq/fp'
import {
  GroceryListEntity,
  GroceryListId,
  type GroceryListType,
} from '@domain/grocery-list/grocery-list.entity'
import { UserEntity, UserIdSchema } from '@domain/user/user.entity'
import { BaseEntity } from '@domain/utils/base.entity'
import { makeCodecBridge } from '@domain/utils/zod/codec-bridge'
import { defineEntitySchema } from '@domain/utils/zod/entity-schema'
import { Opt } from '@domain/utils/zod/refined-types'
import { z } from 'zod/v4'
import { ItemListMismatchError, ItemOwnershipError } from './item.errors'

export const ItemStatusSchema = z.enum(['pending', 'bought'])

export const ItemSchema = defineEntitySchema('ItemId', {
  listId: GroceryListId,
  name: z.string().min(1),
  quantity: z.number().positive(),
  notes: Opt(z.string()),
  status: ItemStatusSchema,
  createdBy: UserIdSchema,
})

export const ItemCreateSchema = ItemSchema.pick({
  name: true,
  quantity: true,
  notes: true,
})
export type ItemCreateData = z.output<typeof ItemCreateSchema>

export const ItemUpdateSchema = ItemSchema.pick({
  name: true,
  quantity: true,
  status: true,
  notes: true,
}).partial()

export type ItemType = z.output<typeof ItemSchema>
export type ItemEncoded = z.input<typeof ItemSchema>
export type ItemStatus = z.output<typeof ItemStatusSchema>

export type ItemUpdateData = z.output<typeof ItemUpdateSchema>
export type ItemUpdateDataEncoded = z.input<typeof ItemUpdateSchema>

const bridge = makeCodecBridge(ItemSchema)

export class ItemEntity
  extends BaseEntity<
    ItemType['id'],
    ItemType['createdAt'],
    ItemType['updatedAt']
  >
  implements ItemType
{
  override readonly id: ItemType['id']

  readonly listId: ItemType['listId']
  readonly name: string
  readonly quantity: number
  readonly status: ItemStatus
  readonly createdBy: ItemType['createdBy']
  readonly notes: ItemType['notes']

  private constructor(data: ItemType) {
    super(data)
    this.id = data.id
    this.listId = data.listId
    this.name = data.name
    this.quantity = data.quantity
    this.status = data.status
    this.createdBy = data.createdBy
    this.notes = data.notes
  }

  static create(
    data: ItemCreateData,
    list: GroceryListType,
    owner: UserEntity,
  ) {
    return new ItemEntity({
      ...ItemSchema.baseInit(),
      ...data,
      listId: list.id,
      createdBy: owner.id,
      status: 'pending',
    })
  }

  static from(data: ItemType): ItemEntity {
    return new ItemEntity(data)
  }

  static fromEncoded(data: ItemEncoded) {
    return bridge.deserialize(data).map((d) => new ItemEntity(d))
  }

  isPending(): boolean {
    return this.status === 'pending'
  }

  isBought(): boolean {
    return this.status === 'bought'
  }

  belongsToList(listId: GroceryListType['id']): boolean {
    return this.listId === listId
  }

  isCreatedBy(userId: ItemType['createdBy']): boolean {
    return this.createdBy === userId
  }

  ensureCanBeModifiedBy(
    list: GroceryListEntity,
    user: UserEntity,
  ): Result<this, ItemOwnershipError> {
    if (!this.isCreatedBy(user.id) && !list.isOwner(user.id)) {
      return R.Err(new ItemOwnershipError(this.id))
    }

    return R.Ok(this)
  }

  ensureBelongsToList(
    list: GroceryListEntity,
  ): Result<this, ItemListMismatchError> {
    if (!this.belongsToList(list.id)) {
      return R.Err(new ItemListMismatchError(this.id, list.id))
    }

    return R.Ok(this)
  }

  serialize() {
    return bridge.serialize(this)
  }

  updateData() {
    // return FpUtils.omitFrom(this.serialize(), '')
    // return this.serialize().map(FpUtils.omit('id', 'createdAt', 'listId'))
  }
}
