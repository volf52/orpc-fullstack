import { Schema as S } from "effect"
import type { JSONSchema7 } from "json-schema"

export const UUID = S.UUID.pipe(S.brand("UUID")).annotations({
  description: "A universally unique identifier (UUID)",
  identifier: "UUID",
  message: (_issue) => "Invalid UUID format",
  jsonSchema: {
    format: "uuid",
  } satisfies JSONSchema7,
})

// WARN: encode method will use first member of the union
export const DateTime = S.Union(
  S.DateFromNumber,
  S.DateFromString,
  S.DateFromSelf,
)
  .pipe(S.brand("DateTime"))
  // TODO: add refinements/filters for invalid dates
  .annotations({
    description:
      "A date and time value, can be a number (timestamp) or a string (ISO format)",
    identifier: "DateTime",
    message: (_issue) => "Invalid date/time format",
  })
