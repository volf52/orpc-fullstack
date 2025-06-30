import { matchRes } from "@carbonteq/fp/match"
import { DateTime, UUID } from "@domain/utils/refined-types"
import {
  BaseEntity,
  BetterStruct,
  createEncoderDecoderBridge,
} from "@domain/utils/schema-utils"
import { Schema as S } from "effect"

const s = DateTime.now()

console.debug(S.encodeEither(DateTime)(s))
