import { $ZodError, type $ZodIssue } from 'zod/v4/core'
import { ValidationError, type ValidationIssue } from '../base.errors'

export const mapZodIssueToValidationIssue = (
  issue: $ZodIssue,
): ValidationIssue => {
  return {
    message: issue.message,
    field: issue.path.join('.'),
    value: issue.input,
    path: issue.path.map((p) => p.toString()),
    cause: issue.code,
  }
}

export const zodErrorToValidationError = (
  error: $ZodError,
): ValidationError => {
  const issues = error.issues.map(mapZodIssueToValidationIssue)
  return ValidationError.multiple(issues, {
    zodError: error,
  })
}
