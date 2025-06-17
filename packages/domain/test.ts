import { matchRes } from "@carbonteq/fp/match"
import { DateTime, UUID } from "@domain/utils/refined-types"
import {
  BetterStruct,
  createEncoderDecoderBridge,
} from "@domain/utils/schema-utils"
import { Schema as S } from "effect"

const UserSchema = BetterStruct("User", {
  id: UUID.pipe(S.brand("UserId")),
  test: UUID.pipe(S.brand("UUID")),
  createdAt: DateTime,
  updatedAt: DateTime,
})
type UserType = S.Schema.Type<typeof UserSchema>
type TUUID = UserType["test"]
type UserId = UserType["id"]

const acceptsUUID = (_t: TUUID) => {}
const acceptsUserId = (_t: UserId) => {}

const bridge = createEncoderDecoderBridge(UserSchema)
const values = {
  id: crypto.randomUUID(),
  test: crypto.randomUUID(),
  createdAt: Date.now(),
  updatedAt: new Date(),
}

const decoded = bridge.deserialize(values).mapErr((err) => err.message)

matchRes(decoded, {
  Ok: (value) => {
    console.debug("Decoded value:", value)
    acceptsUUID(value.test)
    acceptsUUID(value.id)

    acceptsUserId(value.id)
    //@ts-expect-error: Should give an error due to missing brand
    acceptsUserId(value.test)

    const encoded = bridge.serialize(value)
    console.debug("Encoded value:", encoded.safeUnwrap())
  },
  Err: (error) => {
    console.error("Decoding error")
    console.error(error)
  },
})
