import { Option } from "@carbonteq/fp"
import { DateTime as DT, ParseResult, Schema as S } from "effect"
import type { JSONSchema7 } from "json-schema"
import { addMethodsToSchema, createEncoderDecoderBridge } from "./schema-utils"

export const UUIDBase = S.asSchema(
  S.UUID.pipe(S.brand("UUID")).annotations({
    description: "A universally unique identifier (UUID)",
    identifier: "UUID",
    message: (_issue) => "Invalid UUID format",
    jsonSchema: {
      format: "uuid",
      examples: [
        "a211529c-770d-4c71-814a-ff3d11e491ab",
        "27063a98-2a56-4fa9-aaa9-0f35ce10a783",
      ],
    } satisfies JSONSchema7,
  }),
)

export const UUID = addMethodsToSchema(UUIDBase, {
  // Works with chained brands as well
  new: () => crypto.randomUUID() as S.Schema.Type<typeof UUIDBase>,
})

export type UUIDType = S.Schema.Type<typeof UUID>
export type UUIDEncoded = S.Schema.Encoded<typeof UUID>

const DateTimeBase = S.asSchema(
  S.Union(
    S.DateTimeUtcFromNumber,
    S.DateTimeUtc,
    S.DateTimeUtcFromDate,
    S.DateTimeUtcFromSelf,
  ).annotations({
    description:
      "A date and time value, can be a number (timestamp) or a string (ISO format)",
    identifier: "DateTime",
    message: (_issue) => "Invalid date/time format",
  }),
)
export type DateTimeType = S.Schema.Type<typeof DateTimeBase>
export type DateTimeEncoded = S.Schema.Encoded<typeof DateTimeBase>
const dtBridge = createEncoderDecoderBridge(DateTimeBase)

export const DateTime = addMethodsToSchema(DateTimeBase, {
  now: () => DT.unsafeNow(),
  bridge: dtBridge,
})

export const Opt = <Inner, Outer, R>(
  schema: S.Schema<Inner, Outer, R>,
): S.Schema<Option<Inner>, Outer | null, R> =>
  S.declare(
    [schema],
    {
      decode: (schema) => (input, parseOptions, _ast) => {
        if (input === null) {
          return ParseResult.succeed(Option.None)
        }

        // At this point, input is not null, so we assume it to be an item that should conform to the schema
        const validated = ParseResult.decodeUnknown(schema)(input, parseOptions)
        return ParseResult.map(validated, Option.Some)
      },
      encode: (schema) => (input, parseOptions, ast) => {
        // Accept an Option only
        if (input instanceof Option) {
          if (input.isNone()) {
            return ParseResult.succeed(null)
          }

          const item = input.unwrap()
          // validate item using schema
          const validated = ParseResult.encodeUnknown(schema)(
            item,
            parseOptions,
          )
          return validated
        }

        const issue = new ParseResult.Type(ast, input)
        return ParseResult.fail(issue)
      },
    },
    {
      description: `Option<${S.format(schema)}> (compatible with @carbonteq/fp)`,
      identifier: "Option",
      default: Option.None,
      jsonSchema: {
        examples: [null, "abc"],
        description: "An optional value that can be null or a valid item",
      } satisfies JSONSchema7,
    },
  )
