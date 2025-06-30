import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { Opt, UUID } from "@domain/utils/refined-types"
import { createEncoderDecoderBridge } from "@domain/utils/schema-utils"
import { Schema as S } from "effect"

export const AuthUserSchema = defineEntityStruct({
  id: UUID.pipe(S.brand("AuthUserId")),
  name: S.String.pipe(S.minLength(1)),
  email: S.String.pipe(S.minLength(1), S.brand("Email")),
  emailVerified: S.Boolean,
  image: Opt(S.String),
})

export type AuthUserType = S.Schema.Type<typeof AuthUserSchema>
export type AuthUserEncoded = S.Schema.Encoded<typeof AuthUserSchema>

const bridge = createEncoderDecoderBridge(AuthUserSchema)

export class AuthUserEntity extends BaseEntity implements AuthUserType {
  override readonly id: AuthUserType["id"] // will need to override when defining new brand

  readonly name: string
  readonly email: AuthUserType["email"]
  readonly emailVerified: boolean
  readonly image: AuthUserType["image"]

  private constructor(data: AuthUserType) {
    super(data)
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.emailVerified = data.emailVerified
    this.image = data.image
  }

  static from(data: AuthUserType): AuthUserEntity {
    return new AuthUserEntity(data)
  }

  static fromEncoded(data: AuthUserEncoded) {
    const decoded = bridge.deserialize(data)

    return decoded
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
