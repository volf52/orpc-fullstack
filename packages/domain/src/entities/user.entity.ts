import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { Opt, UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"

export const UserIdSchema = UUID.pipe(S.brand("UserId"))
export const UserSchema = defineEntityStruct({
  id: UserIdSchema,
  name: S.String.pipe(S.minLength(1)),
  email: S.String.pipe(S.minLength(1), S.brand("Email")),
  emailVerified: S.Boolean,
  image: Opt(S.String),
})

export type UserType = S.Schema.Type<typeof UserSchema>
export type UserEncoded = S.Schema.Encoded<typeof UserSchema>

const bridge = createEncoderDecoderBridge(UserSchema)

export class UserEntity extends BaseEntity implements UserType {
  override readonly id: UserType["id"]

  readonly name: string
  readonly email: UserType["email"]
  readonly emailVerified: boolean
  readonly image: UserType["image"]

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
    return bridge.serialize({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
      image: this.image,
    })
  }
}
