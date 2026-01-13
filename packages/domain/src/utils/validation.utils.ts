import { ValidationError, type ValidationIssue } from './base.errors'

// Effect Schema validation error conversion removed - use zodErrorToValidationError from zod/error-mapper.ts instead

export const mergeValidationErrors = (
  errors: ValidationError[],
): ValidationError => {
  const issues: ValidationIssue[] = errors.flatMap((err) => err.issues)

  return ValidationError.multiple(issues)
}

export const validationErrorsToSingle = (
  errors: ValidationError[],
): ValidationError => {
  if (errors.length === 0) {
    return ValidationError.single('Unknown validation error')
  }

  if (errors.length === 1) {
    return errors[0] as ValidationError
  }

  const allIssues = errors.flatMap((error) => error.issues)
  return ValidationError.multiple(allIssues)
}
