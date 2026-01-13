import type { Result, UnitResult } from '@carbonteq/fp'
import type { ValidationError } from './base.errors'

// Re-export Zod-based utilities as the canonical versions
export * from './base.entity'
export * from './base.errors'
export { FpUtils } from './fp-utils'
export * from './pagination.utils'
export * from './zod/refined-types'
export * from './zod/schema-utils'

type RepoErrors = ValidationError
export type RepoResult<T, E = RepoErrors> = Result<T, E | RepoErrors>
export type RepoUnitResult<E = RepoErrors> = UnitResult<E | RepoErrors>
