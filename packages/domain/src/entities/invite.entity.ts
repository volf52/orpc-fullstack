import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { DateTime, UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { DateTime as DT, Schema as S } from "effect"
import { GroceryListId, type GroceryListType } from "./grocery-list.entity"

export const InviteRoleSchema = S.Literal("editor")

export const InviteSchema = defineEntityStruct({
  id: UUID.pipe(S.brand("InviteId")),
  listId: GroceryListId,
  token: S.String.pipe(S.minLength(1)),
  role: InviteRoleSchema,
  expiresAt: DateTime,
})

export type InviteType = S.Schema.Type<typeof InviteSchema>
export type InviteEncoded = S.Schema.Encoded<typeof InviteSchema>
export type InviteRole = S.Schema.Type<typeof InviteRoleSchema>

const bridge = createEncoderDecoderBridge(InviteSchema)

export class InviteEntity extends BaseEntity implements InviteType {
  override readonly id: InviteType["id"]

  readonly listId: InviteType["listId"]
  readonly token: InviteType["token"]
  readonly role: InviteRole
  readonly expiresAt: InviteType["expiresAt"]

  private constructor(data: InviteType) {
    super(data)
    this.id = data.id
    this.listId = data.listId
    this.token = data.token
    this.role = data.role
    this.expiresAt = data.expiresAt
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
    return DT.unsafeIsPast(this.expiresAt)
  }

  belongsToList(listId: GroceryListType["id"]): boolean {
    return this.listId === listId
  }

  serialize() {
    return bridge.serialize({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      listId: this.listId,
      token: this.token,
      role: this.role,
      expiresAt: this.expiresAt,
    })
  }
}
