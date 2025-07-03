import { eitherToResult } from "@domain/index"
import { Schema as S } from "effect"
import { parseErrorToValidationError } from "./validation-error.utils"

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
  ).mapErr(parseErrorToValidationError)
}
