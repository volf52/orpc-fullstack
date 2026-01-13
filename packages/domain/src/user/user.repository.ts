import type { Result } from '@carbonteq/fp'
import type { RepoResult } from '@domain/utils'
import type { UserEntity, UserType } from './user.entity'
import type { UserNotFoundError } from './user.errors'

export interface UserUpdateData {
  name?: string
  email?: UserType['email']
  emailVerified?: boolean
  image?: UserType['image']
}

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<Result<UserEntity, Error>>
  abstract findById(
    id: UserType['id'],
  ): Promise<RepoResult<UserEntity, UserNotFoundError>>
  abstract findByEmail(
    email: UserType['email'],
  ): Promise<RepoResult<UserEntity, UserNotFoundError>>
  abstract update(
    id: UserType['id'],
    updates: UserUpdateData,
  ): Promise<RepoResult<UserEntity, UserNotFoundError>>
  abstract delete(id: UserType['id']): Promise<Result<void, UserNotFoundError>>
  abstract exists(id: UserType['id']): Promise<boolean>
  abstract existsByEmail(email: UserType['email']): Promise<boolean>
}
