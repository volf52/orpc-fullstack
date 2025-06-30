import { Result } from "@carbonteq/fp/result"
import { Effect, Either, Cause, Option } from "effect"

export const eitherToResult = <R, L>(e: Either.Either<R, L>): Result<R, L> =>
  Either.match(e, {
    onLeft: Result.Err,
    onRight: Result.Ok,
  })

export const resultToEither = <T, E>(r: Result<T, E>): Either.Either<T, E> =>
  r.isOk() ? Either.right(r.unwrap()) : Either.left(r.unwrapErr())

// Convert Effect to Result by running it synchronously
export const effectToResult = <A, E>(
  effect: Effect.Effect<A, E, never>,
): Result<A, E> => {
  try {
    const exit = Effect.runSyncExit(effect)

    if (exit._tag === "Success") {
      return Result.Ok(exit.value)
    } else {
      if (Cause.isInterrupted(exit.cause)) {
        throw new Error(
          "Cannot run effect synchronously - it contains async operations"
        )
      } else {
        // Get the first failure or defect from the cause
        const failureOption = Cause.failureOption(exit.cause)
        if (Option.isSome(failureOption)) {
          return Result.Err(failureOption.value)
        }

        // If not a failure, it's likely a defect - throw it
        throw Cause.squash(exit.cause)
      }
    }
  } catch (error: any) {
    // Check if it's an AsyncFiberException (async boundary error)
    if (error && typeof error === 'object' && error._tag === 'AsyncFiberException') {
      throw new Error(
        "Cannot run effect synchronously - it contains async operations"
      )
    }
    throw error
  }
}

export const effectToResultAsync = async <A, E>(
  effect: Effect.Effect<A, E, never>,
): Promise<Result<A, E>> => {
  const either = await Effect.runPromise(Effect.either(effect))
  return eitherToResult(either)
}

export const resultToEffect = <T, E>(r: Result<T, E>): Effect.Effect<T, E, never> =>
  r.isOk() ? Effect.succeed(r.unwrap()) : Effect.fail(r.unwrapErr())
