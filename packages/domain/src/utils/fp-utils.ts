import { Result } from "@carbonteq/fp/result"
import { Effect, Either } from "effect"

export const eitherToResult = <R, L>(e: Either.Either<R, L>): Result<R, L> =>
  Either.match(e, {
    onLeft: Result.Err,
    onRight: Result.Ok,
  })

export const effectToResult = <R, E, A>(
  e: Effect.Effect<A, E, R>,
): Result<A, E> => {
  Effect.matchEffect(e, {
    onFailure: Result.Err,
    onSuccess: Result.Ok,
  })
}
