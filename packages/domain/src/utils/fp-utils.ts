import { Result } from "@carbonteq/fp/result"
import { Cause, Effect, Either, Option } from "effect"

export const eitherToResult = <R, L>(e: Either.Either<R, L>): Result<R, L> =>
  Either.match(e, {
    onLeft: Result.Err,
    onRight: Result.Ok,
  })

export const resultToEither = <T, E>(r: Result<T, E>): Either.Either<T, E> =>
  r.isOk() ? Either.right(r.unwrap()) : Either.left(r.unwrapErr())

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
          "Cannot run effect synchronously - it contains async operations",
        )
      } else {
        const failureOption = Cause.failureOption(exit.cause)
        if (Option.isSome(failureOption)) {
          return Result.Err(failureOption.value)
        }

        throw Cause.squash(exit.cause)
      }
    }
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "_tag" in error &&
      error._tag === "AsyncFiberException"
    ) {
      throw new Error(
        "Cannot run effect synchronously - it contains async operations",
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

export const resultToEffect = <T, E>(
  r: Result<T, E>,
): Effect.Effect<T, E, never> =>
  r.isOk() ? Effect.succeed(r.unwrap()) : Effect.fail(r.unwrapErr())

type WithSerialize<T> = {
  serialize: () => T
}

export const ResultUtils = {
  serialized: <T>(obj: WithSerialize<T>): T => obj.serialize(),
  pick:
    <T extends Record<string, unknown>, K extends keyof T, E>(...keys: K[]) =>
    (result: Result<T, E>) => {
      return result.map((value) => {
        const picked: Partial<T> = {}
        for (const key of keys) {
          if (key in value) {
            picked[key] = value[key]
          }
        }
        return picked as Pick<T, K>
      })
    },

  /**
   * Extract a single key from a Result's value
   */
  extract:
    <T extends Record<string, unknown>, K extends keyof T, E>(key: K) =>
    (result: Result<T, E>): Result<T[K], E> => {
      return result.map((value) => {
        if (key in value) {
          return value[key]
        }
        throw new Error(`Key ${String(key)} not found in result`)
      })
    },

  /**
   * Transform a Result's value to a new type
   */
  transform:
    <T, U, E>(fn: (value: T) => U) =>
    (result: Result<T, E>): Result<U, E> => {
      return result.map(fn)
    },

  /**
   * Apply a function to multiple Results and collect all successful results
   */
  collect: <T, E>(results: Result<T, E>[]): Result<T[], E[]> => {
    const successes: T[] = []
    const errors: E[] = []

    for (const result of results) {
      if (result.isOk()) {
        successes.push(result.unwrap())
      } else {
        errors.push(result.unwrapErr())
      }
    }

    return errors.length === 0 ? Result.Ok(successes) : Result.Err(errors)
  },

  /**
   * Filter Results, keeping only successful ones
   */
  filterOk: <T, E>(results: Result<T, E>[]): T[] => {
    return results.filter((r) => r.isOk()).map((r) => r.unwrap())
  },

  /**
   * Filter Results, keeping only failed ones
   */
  filterErr: <T, E>(results: Result<T, E>[]): E[] => {
    return results.filter((r) => r.isErr()).map((r) => r.unwrapErr())
  },

  /**
   * Map over a list with a function that returns Results, collecting all successful results
   */
  mapCollect:
    <T, U, E>(fn: (item: T) => Result<U, E>) =>
    (items: T[]): Result<U[], E[]> => {
      const results = items.map(fn)
      return ResultUtils.collect(results)
    },
} as const
