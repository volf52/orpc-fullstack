import { Option } from '@carbonteq/fp'
import { z } from 'zod'
import { makeCodecBridge } from './codec-bridge'
import { addMethodsToSchema } from './schema-utils'

export const UUIDBase = z.string().uuid().brand<'UUID'>()
type UUIDBaseType = typeof UUIDBase

export type TUUIDBase = z.infer<typeof UUIDBase>
export type TaggedUUID<Tag extends string> = TUUIDBase & z.core.$brand<Tag>

export const UUID = addMethodsToSchema(UUIDBase, {
  new: (): TUUIDBase => crypto.randomUUID() as TUUIDBase,
  extend: <Tag extends string>(tag: Tag) => {
    const branded = UUIDBase.brand<Tag>(tag) as z.core.$ZodBranded<
      UUIDBaseType,
      Tag
    >

    return addMethodsToSchema(branded, {
      new: (): TaggedUUID<Tag> => crypto.randomUUID() as TaggedUUID<Tag>,
    })
  },
})

const dateTimeInput = z.union([z.int().min(0), z.iso.datetime(), z.date()])
const dateTimeCodec = z.codec(dateTimeInput, z.date(), {
  decode: (value) => {
    if (value instanceof Date) {
      return value
    }
    return new Date(value)
  },
  encode: (date) => date.getTime(),
})

export const DateTime = addMethodsToSchema(dateTimeCodec, {
  now: () => new Date(),
  bridge: makeCodecBridge(dateTimeCodec),
})

export const Opt = <InnerOut, InnerIn>(
  schema: z.ZodType<InnerOut, InnerIn>,
) => {
  const input = z.custom<InnerIn | null>(
    (value) => value === null || schema.safeParse(value).success,
    { message: 'Invalid value' },
  )
  const output = z.custom<Option<InnerOut>>(
    (value) => value instanceof Option,
    { message: 'Expected Option' },
  )

  return z.codec(input, output, {
    decode: (value) =>
      value === null ? Option.None : Option.Some(z.decode(schema, value)),
    encode: (value) =>
      value.isNone() ? null : z.encode(schema, value.unwrap()),
  })
}

if (import.meta.main) {
  const bridge = makeCodecBridge(DateTime)

  console.debug('Expect: false, actual: ', bridge.deserialize('abc').isOk())
  console.debug('Expect: false, actual: ', bridge.deserialize(-123).isOk())
  console.debug(
    'Expect: false, actual: ',
    bridge.deserialize(new Date('abc')).isOk(),
  )
  console.debug('Expect: false, actual: ', bridge.deserialize({}).isOk())

  console.debug('Expect: true, actual: ', bridge.deserialize(new Date()).isOk())
  console.debug('Expect: true, actual: ', bridge.deserialize(Date.now()).isOk())
  console.debug(
    'Expect: true, actual: ',
    bridge.deserialize(new Date().toISOString()).isOk(),
  )

  console.debug('Encode: ', bridge.serialize(new Date()))
}
