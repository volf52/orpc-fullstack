import { Schema as S } from "effect"

const UserSchema = S.Struct({
  id: S.UUID,
  createdAt: S.DateFromNumber,
  updatedAt: S.DateFromNumber,
})
