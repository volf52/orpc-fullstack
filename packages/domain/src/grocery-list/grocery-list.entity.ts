import type { Result } from '@carbonteq/fp'
import { Result as R } from '@carbonteq/fp'
import { UserEntity, UserIdSchema } from '@domain/user/user.entity'
import { BaseEntity } from '@domain/utils/base.entity'
import { FpUtils } from '@domain/utils/fp-utils'
import { makeCodecBridge } from '@domain/utils/zod/codec-bridge'
import { defineEntitySchema } from '@domain/utils/zod/entity-schema'
import { z } from 'zod/v4'
import { GroceryListOwnershipError } from './grocery-list.errors'

export const GroceryListSchema = defineEntitySchema('GroceryListId', {
  name: z.string().min(3),
  description: z.string(),
  active: z.boolean(),
  ownerId: UserIdSchema,
})
export const GroceryListId = GroceryListSchema.id

export const GroceryListCreateSchema = GroceryListSchema.pick({
  name: true,
  description: true,
})

export const GroceryListUpdateSchema = GroceryListSchema.pick({
  name: true,
  description: true,
  active: true,
}).partial()

export type GroceryListType = z.output<typeof GroceryListSchema>
export type GroceryListEncoded = z.input<typeof GroceryListSchema>
export type GroceryListUpdateData = z.output<typeof GroceryListUpdateSchema>
export type GroceryListCreateData = z.output<typeof GroceryListCreateSchema>

const bridge = makeCodecBridge(GroceryListSchema)

export class GroceryListEntity
  extends BaseEntity<
    GroceryListType['id'],
    GroceryListType['createdAt'],
    GroceryListType['updatedAt']
  >
  implements GroceryListType
{
  override readonly id: GroceryListType['id']

  readonly name: string
  readonly active: boolean
  readonly description: GroceryListType['description']
  readonly ownerId: GroceryListType['ownerId']

  private constructor(data: GroceryListType) {
    super(data)
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.ownerId = data.ownerId
    this.active = data.active
  }

  static create(
    data: GroceryListCreateData,
    owner: UserEntity,
  ): GroceryListEntity {
    const groceryListData: GroceryListType = {
      ...GroceryListSchema.baseInit(),
      ...data,
      ownerId: owner.id,
      active: false,
    }

    return new GroceryListEntity(groceryListData)
  }

  static from(data: GroceryListType): GroceryListEntity {
    return new GroceryListEntity(data)
  }

  static fromEncoded(data: GroceryListEncoded) {
    return bridge.deserialize(data).map((d) => new GroceryListEntity(d))
  }

  isOwner(userId: GroceryListType['ownerId']): boolean {
    return this.ownerId === userId
  }

  ensureIsOwner(user: UserEntity): Result<this, GroceryListOwnershipError> {
    if (!this.isOwner(user.id)) {
      return R.Err(new GroceryListOwnershipError(this.id))
    }
    return R.Ok(this)
  }

  serialize() {
    return bridge.serialize(this)
  }

  updateData() {
    return FpUtils.omitFrom(this.serialize(), ['id', 'createdAt', 'ownerId'])
  }
}
