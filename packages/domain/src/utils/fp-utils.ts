import { Result } from '@carbonteq/fp/result'
import { ValidationError } from './base.errors'
import type { Paginated } from './pagination.utils'
import { validationErrorsToSingle } from './validation.utils'

// Effect FP conversion functions removed - only used in tests
// Use @carbonteq/fp Result directly instead of Effect types

function mapParseErrors<T>(
  results: Result<T, ValidationError>[],
): Result<T[], ValidationError> {
  const values: T[] = []
  const errors: ValidationError[] = []

  // const t =  Result.all(...results)

  for (const result of results) {
    if (result.isOk()) {
      values.push(result.unwrap())
    } else {
      errors.push(result.unwrapErr())
    }
  }

  if (errors.length > 0) {
    return Result.Err(validationErrorsToSingle(errors))
  }

  return Result.Ok(values)
}

type WithSerialize<T> = {
  serialize: () => T
}

type WithSerializeAndId<T, Id> = {
  id: Id
  serialize: () => Result<T, ValidationError>
}

function collectValidationErrors<T>(
  results: Result<Promise<T>, ValidationError>[],
): never
function collectValidationErrors<T>(
  results: Result<T, ValidationError>[],
): Result<T[], ValidationError>
function collectValidationErrors<T>(results: Result<T, ValidationError>[]) {
  return Result.all(...results).mapErr(validationErrorsToSingle)
}

const omitFrom = <T extends Record<string, unknown>, K extends (keyof T)[]>(
  data: T,
  keys: K,
): Omit<T, K[number]> => {
  const picked: Partial<T> = {}
  for (const key of Object.keys(data) as K) {
    if (keys.includes(key)) {
      continue
    }

    picked[key] = data[key]
  }

  return picked as Omit<T, K[number]>
}

export const FpUtils = {
  serialized: <T>(obj: WithSerialize<T>): T => obj.serialize(),
  serializedPreserveId: <T, Id>(
    obj: WithSerializeAndId<T, Id>,
  ): Result<Omit<T, 'id'> & { id: Id }, ValidationError> =>
    obj.serialize().map((data) => ({ ...data, id: obj.id })),

  pick:
    <T extends Record<string, unknown>, K extends (keyof T)[]>(...keys: K) =>
    (obj: T) => {
      const picked: Partial<T> = {}
      for (const key of keys) {
        picked[key] = obj[key]
      }

      return picked as Pick<T, K[number]>
    },
  extract:
    <T extends Record<string, unknown>, K extends keyof T>(key: K) =>
    (obj: T): T[K] =>
      obj[key],

  omitFrom,
  omit:
    <T extends Record<string, unknown>, K extends (keyof T)[]>(...keys: K) =>
    (obj: T): Omit<T, K[number]> =>
      omitFrom(obj, keys),

  collectSuccessful: <T, E>(results: Result<T, E>[]): Result<T[], E[]> => {
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

  filterOk: <T, E>(results: Result<T, E>[]): T[] => {
    return results.filter((r) => r.isOk()).map((r) => r.unwrap())
  },

  filterErr: <T, E>(results: Result<T, E>[]): E[] => {
    return results.filter((r) => r.isErr()).map((r) => r.unwrapErr())
  },

  log: <T, E>(result: Result<T, E>, prefix: string = '') => {
    if (result.isOk()) {
      console.log(`${prefix} Success:`, result.unwrap())
    } else {
      console.error(`${prefix} Error:`, result.unwrapErr())
    }
  },
  mapParseErrors,

  collectValidationErrors,
  paginatedSerialize: <T>(
    r: Paginated<WithSerialize<Result<T, ValidationError>>>,
  ) => {
    const serializedItems = r.items.map((item) => item.serialize())
    const rolledValidationErrors = collectValidationErrors(serializedItems)

    return rolledValidationErrors.map(
      (items) =>
        ({
          ...r,
          items,
        }) satisfies Paginated<T>,
    )
  },
} as const
