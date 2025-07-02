import { eitherToResult } from "@domain/index"
import { ValidationError } from "@domain/utils/base.errors"
import { Schema as S } from "effect"

export const validateWithEffect = <In, Out>(
  schema: S.Schema<Out, In>,
  data: unknown,
) => {
  return eitherToResult(
    S.decodeUnknownEither(schema)(data, {
      errors: "all",
      onExcessProperty: "ignore",
      exact: true,
    }),
  ).mapErr(
    (parseError) =>
      new ValidationError(parseError.message, "", null, { from: parseError }),
  )
}
