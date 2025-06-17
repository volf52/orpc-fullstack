import { Result } from "@carbonteq/fp"
import { Either, Schema as S, type SchemaAST } from "effect"
import type { ParseError } from "effect/ParseResult"
import { DateTime, UUID } from "./refined-types"

// From https://effect.website/docs/schema/basic-usage/#simplifying-tagged-structs-with-taggedstruct
// Allows the absence of _tag in decode ops
export const BetterStruct = <
  Tag extends SchemaAST.LiteralValue,
  Fields extends S.Struct.Fields,
>(
  tag: Tag,
  fields: Fields,
) =>
  S.Struct({
    _tag: S.Literal(tag).pipe(
      S.optional,
      S.withDefaults({ constructor: () => tag, decoding: () => tag }),
    ),
    ...fields,
  })

export const createEncoderDecoderBridge = <TIn, TOut>(
  schema: S.Schema<TOut, TIn>,
) => {
  const encoder = S.encodeEither(schema, {
    errors: "all",
    exact: true,
    onExcessProperty: "ignore",
    propertyOrder: "none",
  })

  const decoder = S.decodeUnknownEither(schema, {
    errors: "all",
    exact: true,
    onExcessProperty: "ignore",
    propertyOrder: "none",
  })

  const serialize = (value: TOut): Result<TIn, ParseError> =>
    Either.match(encoder(value), {
      onLeft: Result.Err,
      onRight: Result.Ok,
    })

  const deserialize = (value: unknown): Result<TOut, ParseError> =>
    Either.match(decoder(value), {
      onLeft: Result.Err,
      onRight: Result.Ok,
    })

  return { serialize, deserialize } as const
}

export const baseEntityFields = {
  id: UUID,
  createdAt: DateTime,
  updatedAt: DateTime,
} as const satisfies S.Struct.Fields

export type TBaseEntityFields = typeof baseEntityFields

export const BaseEntitySchema = S.Struct(baseEntityFields)

export const BaseEntity = <Fields extends S.Struct.Fields>(
  identifier: string,
  fields: Fields,
) =>
  S.Class<TBaseEntityFields & Fields>(identifier)({
    ...baseEntityFields,
    ...fields,
  })
