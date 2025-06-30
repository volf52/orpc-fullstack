import { BaseEntity, defineEntityStruct } from "@domain/utils/base.entity"
import { Opt } from "@domain/utils/refined-types"
import { Schema as S } from "effect"

export const AuthUserSchema = defineEntityStruct("AuthUserId", {
  name: S.String.pipe(S.minLength(1)),
  email: S.String.pipe(S.minLength(1), S.brand("Email")),
  emailVerified: S.Boolean,
  image: Opt(S.String),
})

export type AuthUserType = S.Schema.Type<typeof AuthUserSchema>
export type AuthUserEncoded = S.Schema.Encoded<typeof AuthUserSchema>

export class AuthUserEntity extends BaseEntity {}
