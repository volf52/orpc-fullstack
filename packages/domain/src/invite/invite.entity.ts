import type { UnitResult } from '@carbonteq/fp'
import { Result as R } from '@carbonteq/fp'
import type { GroceryListType } from '@domain/grocery-list/grocery-list.entity'
import { GroceryListId } from '@domain/grocery-list/grocery-list.entity'
import { InviteExpiredError } from '@domain/invite/invite.errors'
import { BaseEntity } from '@domain/utils/base.entity'
import { makeCodecBridge } from '@domain/utils/zod/codec-bridge'
import { defineEntitySchema } from '@domain/utils/zod/entity-schema'
import { DateTime } from '@domain/utils/zod/refined-types'
import { z } from 'zod/v4'

export const InviteRoleSchema = z.literal('editor')

export const InviteSchema = defineEntitySchema('InviteId', {
  listId: GroceryListId,
  token: z.string().min(1),
  role: InviteRoleSchema,
  expiresAt: DateTime,
})

export type InviteType = z.output<typeof InviteSchema>
export type InviteEncoded = z.input<typeof InviteSchema>
export type InviteRole = z.output<typeof InviteRoleSchema>

const bridge = makeCodecBridge(InviteSchema)

export class InviteEntity
  extends BaseEntity<
    InviteType['id'],
    InviteType['createdAt'],
    InviteType['updatedAt']
  >
  implements InviteType
{
  override readonly id: InviteType['id']

  readonly listId: InviteType['listId']
  readonly token: InviteType['token']
  readonly role: InviteRole
  readonly expiresAt: InviteType['expiresAt']

  private constructor(data: InviteType) {
    super(data)
    this.id = data.id
    this.listId = data.listId
    this.token = data.token
    this.role = data.role
    this.expiresAt = data.expiresAt
  }

  static generateInvite(list: GroceryListType): InviteEntity {
    return new InviteEntity({
      ...InviteSchema.baseInit(),
      role: InviteEntity.getDefaultRole(),
      listId: list.id,
      expiresAt: InviteEntity.calculateExpirationDate(),
      token: crypto.randomUUID(),
    })
  }

  static from(data: InviteType): InviteEntity {
    return new InviteEntity(data)
  }

  static fromEncoded(data: InviteEncoded) {
    return bridge.deserialize(data)
  }

  isValid(): boolean {
    return !this.isExpired()
  }

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now()
  }

  belongsToList(listId: GroceryListType['id']): boolean {
    return this.listId === listId
  }

  serialize() {
    return bridge.serialize(this)
  }

  ensureIsValid(): UnitResult<InviteExpiredError> {
    if (this.isExpired()) {
      return R.Err(new InviteExpiredError())
    }

    return R.UNIT_RESULT
  }

  static calculateExpirationDate(daysFromNow = 7): Date {
    const msPerDay = 24 * 60 * 60 * 1000
    return new Date(Date.now() + daysFromNow * msPerDay)
  }

  static getDefaultRole(): InviteRole {
    return 'editor'
  }
}
