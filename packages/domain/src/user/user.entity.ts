import { BaseEntity } from '@domain/utils/base.entity'
import { makeCodecBridge } from '@domain/utils/zod/codec-bridge'
import { defineEntitySchema } from '@domain/utils/zod/entity-schema'
import { Opt } from '@domain/utils/zod/refined-types'
import { z } from 'zod/v4'

export const UserSchema = defineEntitySchema('UserId', {
  name: z.string().min(1),
  email: z.string().min(1).email().brand<'Email'>(),
  emailVerified: z.boolean(),
  image: Opt(z.string()),
})
export const UserIdSchema = UserSchema.id

export type UserType = z.output<typeof UserSchema>
export type UserEncoded = z.input<typeof UserSchema>

export const NewUserSchema = UserSchema.pick({
  email: true,
  name: true,
}).extend({
  password: z.string().min(6),
})
export type NewUserType = z.output<typeof NewUserSchema>
export type NewUserEncoded = z.input<typeof NewUserSchema>

const bridge = makeCodecBridge(UserSchema)

export class UserEntity
  extends BaseEntity<
    UserType['id'],
    UserType['createdAt'],
    UserType['updatedAt']
  >
  implements UserType
{
  override readonly id: UserType['id']

  readonly name: string
  readonly email: UserType['email']
  readonly emailVerified: boolean
  readonly image: UserType['image']

  private constructor(data: UserType) {
    super(data)
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.emailVerified = data.emailVerified
    this.image = data.image
  }

  static from(data: UserType): UserEntity {
    return new UserEntity(data)
  }

  static fromEncoded(data: UserEncoded) {
    return bridge.deserialize(data).map((userData) => new UserEntity(userData))
  }

  serialize() {
    return bridge.serialize(this)
  }
}
