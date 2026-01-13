import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Result } from '@carbonteq/fp'
import { ValidationError } from '@domain/utils/base.errors'
import { makeCodecBridge } from '@domain/utils/zod/codec-bridge'
import { z } from 'zod/v4'

describe('Codec Bridge', () => {
  describe('simple iso string <-> date bridge', () => {
    const codec = z.codec(z.iso.datetime(), z.date(), {
      decode: (isoString) => new Date(isoString),
      encode: (date) => date.toISOString(),
    })
    const bridge = makeCodecBridge(codec)

    it('should have right types', () => {
      expectTypeOf(bridge).toBeObject()
      expect(bridge).toHaveProperty('serialize')
      expect(bridge).toHaveProperty('deserialize')
      expectTypeOf(bridge.deserialize).toBeFunction()
      expectTypeOf(bridge.serialize).toBeFunction()
    })

    it('should decode iso string to date', () => {
      const isoString = '2023-01-01T00:00:00.000Z'
      const result = bridge.deserialize(isoString)
      expect(result).toBeInstanceOf(Result)
      expectTypeOf(result).toEqualTypeOf<Result<Date, ValidationError>>()

      expect(result.isOk()).toBe(true)
      expect(result.isErr()).toBe(false)
      expect(result.unwrap()).toBeInstanceOf(Date)
      expect(() => result.unwrapErr()).toThrow()
    })

    it('should encode date to iso string', () => {
      const isoStr = '2023-01-01T00:00:00.000Z'
      const date = new Date('2023-01-01T00:00:00.000Z')
      const result = bridge.serialize(date)
      expect(result).toBeString()
      expectTypeOf(result).toEqualTypeOf<string>()

      expect(result).toEqual(isoStr)
    })

    it('should lead to same value on roundtrip', () => {
      const isoString = new Date().toISOString()
      const decodeResult = bridge.deserialize(isoString)
      expect(decodeResult.isOk()).toBe(true)
      const date = decodeResult.unwrap()

      const encodeResult = bridge.serialize(date)
      expect(encodeResult).toEqual(isoString)
      expectTypeOf(encodeResult).toEqualTypeOf<string>()
    })

    it('should fail to decode invalid iso string', () => {
      const invalidIsoString = 'invalid-iso-string'
      const result = bridge.deserialize(invalidIsoString)
      expect(result).toBeInstanceOf(Result)
      expectTypeOf(result).toEqualTypeOf<Result<Date, ValidationError>>()

      expect(result.isOk()).toBe(false)
      expect(result.isErr()).toBe(true)
      expect(() => result.unwrap()).toThrow()
      const err = result.unwrapErr()
      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toHaveProperty('message')
      expect(err.message).toContain('Invalid ISO datetime')
    })
  })

  describe('complex user object bridge', () => {
    const userSchema = z.object({
      id: z.uuid(),
      name: z.string().min(2).max(100),
      email: z.email(),
      createdAt: z.date(),
    })

    const bridge = makeCodecBridge(userSchema)

    it('should have right types', () => {
      expectTypeOf(bridge).toBeObject()
      expect(bridge).toHaveProperty('serialize')
      expect(bridge).toHaveProperty('deserialize')
      expectTypeOf(bridge.deserialize).toBeFunction()
      expectTypeOf(bridge.serialize).toBeFunction()
    })

    it('should serialize user object to JSON object', () => {
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'abc@dev.com',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      }
      const result = bridge.serialize(user)
      expect(result).toBeObject()
      expect(result).toHaveProperty('id', user.id)
      expect(result).toHaveProperty('name', user.name)
      expect(result).toHaveProperty('email', user.email)
      expect(result).toHaveProperty('createdAt', user.createdAt)
      expectTypeOf(result).toEqualTypeOf<{
        id: string
        name: string
        email: string
        createdAt: Date
      }>()
    })

    it('should deserialize JSON object to user object', () => {
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'test@dev.com',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      }

      const result = bridge.deserialize(user)
      expect(result).toBeInstanceOf(Result)
      expectTypeOf(result).toEqualTypeOf<
        Result<z.infer<typeof userSchema>, ValidationError>
      >()

      expect(result.isOk()).toBe(true)
      expect(result.isErr()).toBe(false)
      expect(result.unwrap()).toEqual(user)
      expect(() => result.unwrapErr()).toThrow()
    })

    it('should fail to deserialize invalid user object', () => {
      const invalidUser = {
        id: 'invalid-uuid',
        name: 'J',
        email: 'invalid-email',
        createdAt: 'not-a-date',
      }

      const result = bridge.deserialize(invalidUser)
      expect(result).toBeInstanceOf(Result)
      expectTypeOf(result).toEqualTypeOf<
        Result<z.infer<typeof userSchema>, ValidationError>
      >()

      expect(result.isOk()).toBe(false)
      expect(result.isErr()).toBe(true)
      expect(() => result.unwrap()).toThrow()
      const err = result.unwrapErr()
      expect(err).toBeInstanceOf(ValidationError)
      expect(err).toHaveProperty('message')
      expect(err.message).toContain('Invalid UUID')
      expect(err.message).toContain('expected string to have >=2 characters')
      expect(err.message).toContain('Invalid email address')
      expect(err.message).toContain('expected date, received string')

      expect(err.issues).toBeArrayOfSize(4)
      expect(err.issues[0]).toHaveProperty('path', ['id'])
      expect(err.issues[0]).toHaveProperty('message')
      expect(err.issues[0]).toHaveProperty('field', 'id')
      expect(err.issues[0]).toHaveProperty('cause', 'invalid_format')
      // expect(err.issues[0]).toHaveProperty("value", invalidUser.id)

      expect(err.issues[1]).toHaveProperty('path', ['name'])
      expect(err.issues[1]).toHaveProperty('field', 'name')
      expect(err.issues[1]).toHaveProperty('cause', 'too_small')

      expect(err.issues[2]).toHaveProperty('path', ['email'])
      expect(err.issues[2]).toHaveProperty('field', 'email')
      expect(err.issues[2]).toHaveProperty('cause', 'invalid_format')

      expect(err.issues[3]).toHaveProperty('path', ['createdAt'])
      expect(err.issues[3]).toHaveProperty('field', 'createdAt')
      expect(err.issues[3]).toHaveProperty('cause', 'invalid_type')
    })
  })
})
