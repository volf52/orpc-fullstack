import type { Result } from "@carbonteq/fp"
import type { InviteNotFoundError } from "@domain/errors/invite.errors"
import type { GroceryListType } from "../entities/grocery-list.entity"
import type {
  InviteEntity,
  InviteRole,
  InviteType,
} from "../entities/invite.entity"

export interface InviteUpdateData {
  role?: InviteRole
  expiresAt?: InviteType["expiresAt"]
}

export abstract class InviteRepository {
  abstract create(invite: InviteEntity): Promise<Result<InviteEntity, Error>>

  abstract findById(
    id: InviteType["id"],
  ): Promise<Result<InviteEntity, InviteNotFoundError>>

  abstract findByToken(
    token: string,
  ): Promise<Result<InviteEntity, InviteNotFoundError>>

  abstract findByListId(listId: GroceryListType["id"]): Promise<InviteEntity[]>

  abstract findActiveByListId(
    listId: GroceryListType["id"],
  ): Promise<InviteEntity[]>

  abstract update(
    id: InviteType["id"],
    updates: InviteUpdateData,
  ): Promise<Result<InviteEntity, InviteNotFoundError>>

  abstract delete(
    id: InviteType["id"],
  ): Promise<Result<void, InviteNotFoundError>>

  abstract deleteByListId(listId: GroceryListType["id"]): Promise<void>

  abstract deleteExpired(): Promise<number>

  abstract exists(id: InviteType["id"]): Promise<boolean>

  abstract existsByToken(token: string): Promise<boolean>
}
