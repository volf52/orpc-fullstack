import { ValidationError, type ValidationIssue } from "@repo/domain"
import type { ParseError } from "effect/ParseResult"

export function parseErrorsToValidationError(
  parseErrors: ParseError[],
): ValidationError {
  if (parseErrors.length === 0) {
    return ValidationError.single("Unknown validation error")
  }

  const issues: ValidationIssue[] = parseErrors.flatMap(parseErrorToIssues)
  return ValidationError.multiple(issues)
}

export const parseErrorToValidationError = (
  error: ParseError,
): ValidationError => {
  const issues = parseErrorToIssues(error)
  return ValidationError.multiple(issues)
}

function parseErrorToIssues(parseError: ParseError): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  collectIssuesFromParseError(parseError, [], issues)

  return issues
}

function collectIssuesFromParseError(
  error: ParseError,
  currentPath: string[],
  issues: ValidationIssue[],
): void {
  // ParseError has a _tag field that indicates the type of error
  // We need to use unknown type to access the internal structure
  const errorRecord = error as unknown as Record<string, unknown>
  const tag = errorRecord._tag as string

  switch (tag) {
    case "Type": {
      issues.push({
        message: error.message,
        field: pathToFieldName(currentPath),
        path: [...currentPath],
        value: extractActualValue(error),
      })
      break
    }

    case "Missing": {
      issues.push({
        message: error.message || "is missing",
        field: pathToFieldName(currentPath),
        path: [...currentPath],
      })
      break
    }

    case "Union": {
      const unionErrors = (errorRecord.errors as ParseError[]) || []
      for (const unionError of unionErrors) {
        collectIssuesFromParseError(unionError, currentPath, issues)
      }
      break
    }

    case "Tuple":
    case "TypeLiteral": {
      const elementErrors = (errorRecord.errors as ParseError[]) || []
      for (const elementError of elementErrors) {
        const elementPath = extractPathFromError(elementError)
        const newPath = elementPath
          ? [...currentPath, ...elementPath]
          : currentPath
        collectIssuesFromParseError(elementError, newPath, issues)
      }
      break
    }

    case "Index": {
      const index = errorRecord.index as number
      const indexError = errorRecord.error as ParseError
      if (indexError) {
        const newPath = [...currentPath, String(index)]
        collectIssuesFromParseError(indexError, newPath, issues)
      }
      break
    }

    case "Key": {
      const key = errorRecord.key as string
      const keyError = errorRecord.error as ParseError
      if (keyError) {
        const newPath = [...currentPath, String(key)]
        collectIssuesFromParseError(keyError, newPath, issues)
      }
      break
    }

    default: {
      issues.push({
        message: extractErrorMessage(error) || "Validation failed",
        field: pathToFieldName(currentPath),
        path: [...currentPath],
        value: extractActualValue(error),
      })
    }
  }
}

/**
 * Extracts a human-readable error message from a ParseError.
 */
function extractErrorMessage(error: ParseError): string {
  // Try to get the message from various possible locations
  const errorRecord = error as unknown as Record<string, unknown>

  if (typeof errorRecord.message === "string") {
    return errorRecord.message
  }

  if (errorRecord.expected && errorRecord.actual !== undefined) {
    return `Expected ${errorRecord.expected}, actual ${JSON.stringify(
      errorRecord.actual,
    )}`
  }

  if (errorRecord.expected) {
    return `Expected ${errorRecord.expected}`
  }

  // Fallback to a generic message
  return "Validation failed"
}

/**
 * Extracts the actual value that failed validation from a ParseError.
 */
function extractActualValue(error: ParseError): unknown {
  const errorRecord = error as unknown as Record<string, unknown>
  return errorRecord.actual
}

function extractPathFromError(error: ParseError): string[] | undefined {
  const errorRecord = error as unknown as Record<string, unknown>
  const path = errorRecord.path
  return Array.isArray(path) ? path : undefined
}

function pathToFieldName(path: string[]): string | undefined {
  return path.length > 0 ? path.join(".") : undefined
}

export function validationErrorsToSingle(
  errors: ValidationError[],
): ValidationError {
  if (errors.length === 0) {
    return ValidationError.single("Unknown validation error")
  }

  if (errors.length === 1) {
    return errors[0] as ValidationError
  }

  const allIssues = errors.flatMap((error) => error.issues)
  return ValidationError.multiple(allIssues)
}
