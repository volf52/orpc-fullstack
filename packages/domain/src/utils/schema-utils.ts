import { Result } from "@carbonteq/fp"
import { Either, Schema as S, type SchemaAST } from "effect"
import type { ParseError } from "effect/ParseResult"

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

const encodeDecodeOpts = {
  errors: "all",
  exact: true,
  onExcessProperty: "ignore",
  propertyOrder: "none",
} as const

export const encodeToResult = <In, Out>(
  schema: S.Schema<Out, In, never>,
  value: Out,
) =>
  Either.match(S.encodeEither(schema, encodeDecodeOpts)(value), {
    onLeft: Result.Err,
    onRight: Result.Ok,
  })

export const decodeUnknownToResult = <In, Out>(
  schema: S.Schema<Out, In, never>,
  value: Out,
) =>
  Either.match(S.decodeUnknownEither(schema, encodeDecodeOpts)(value), {
    onLeft: Result.Err,
    onRight: Result.Ok,
  })

export const createEncoderDecoderBridge = <TIn, TOut>(
  schema: S.Schema<TOut, TIn, never>,
) => {
  const encoder = S.encodeEither(schema, encodeDecodeOpts)
  const decoder = S.decodeUnknownEither(schema, encodeDecodeOpts)

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

export type FieldsEncoded<Fields extends S.Struct.Fields> = S.Schema.Encoded<
  S.Struct<Fields>
>
export type FieldsType<Fields extends S.Struct.Fields> = S.Schema.Encoded<
  S.Struct<Fields>
>

export type ExtendedSchema<
  A,
  I,
  R,
  Methods extends Record<string, unknown>,
> = S.Schema<A, I, R> & Methods

export const addMethodsToSchema = <
  A,
  I,
  R,
  Methods extends Record<string, unknown>,
>(
  schema: S.Schema<A, I, R>,
  methods: Methods,
): ExtendedSchema<A, I, R, Methods> => {
  const extended = schema as ExtendedSchema<A, I, R, Methods>

  for (const [key, value] of Object.entries(methods)) {
    // biome-ignore lint/suspicious/noExplicitAny: Have to work around the type system here
    ;(extended as any)[key] = value
  }

  return extended
}
