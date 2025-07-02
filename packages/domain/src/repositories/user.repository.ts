import type { Result } from "@carbonteq/fp"
import type { UserNotFoundError } from "@domain/errors/user.errors"
import type { UserEntity, UserType } from "../entities/user.entity"

export interface UserUpdateData {
  name?: string
  email?: UserType["email"]
  emailVerified?: boolean
  image?: UserType["image"]
}

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<Result<UserEntity, Error>>

  abstract findById(
    id: UserType["id"],
  ): Promise<Result<UserEntity, UserNotFoundError>>

  abstract findByEmail(
    email: UserType["email"],
  ): Promise<Result<UserEntity, UserNotFoundError>>

  abstract update(
    id: UserType["id"],
    updates: UserUpdateData,
  ): Promise<Result<UserEntity, UserNotFoundError>>

  abstract delete(id: UserType["id"]): Promise<Result<void, UserNotFoundError>>

  abstract exists(id: UserType["id"]): Promise<boolean>

  abstract existsByEmail(email: UserType["email"]): Promise<boolean>
}
