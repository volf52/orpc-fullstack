import { Result } from '@carbonteq/fp'
import { z } from 'zod/v4'
import type { ValidationError } from '../base.errors'
import { zodErrorToValidationError } from './error-mapper'

export const makeCodecBridge = <TIn, TOut>(schema: z.ZodType<TOut, TIn>) => {
  const deserialize = (data: unknown): Result<TOut, ValidationError> => {
    const r = schema.safeParse(data)
    if (r.success) {
      return Result.Ok(r.data)
    }

    return Result.Err(zodErrorToValidationError(r.error))
  }

  const serialize = (data: TOut): TIn => z.encode(schema, data)

  return { serialize, deserialize } as const
}

if (import.meta.main) {
  const codec = z.codec(z.iso.datetime(), z.date(), {
    decode: (s) => new Date(s),
    encode: (d) => d.toISOString(),
  })

  const bridge = makeCodecBridge(codec)

  const d = new Date()
  const isoStr = d.toISOString()

  console.debug('Parsing: ', bridge.deserialize(isoStr).isOk())
  console.debug('Serializing: ', bridge.serialize(d))

  console.debug('Parsing invalid: ', bridge.deserialize('invalid-date').isOk())
  console.debug(
    'Roundtrip equal: ',
    d.getTime() === bridge.deserialize(bridge.serialize(d)).unwrap().getTime(),
  )
}
