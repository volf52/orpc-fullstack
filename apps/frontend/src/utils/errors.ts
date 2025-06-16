type InputValidationError = {
  code: string // 'INPUT_VALIDATION_ERROR'
  message: string
  data: {
    formErrors: string[]
    fieldErrors: Record<string, string[] | undefined>
  }
}

export const isInputValidationErr = (
  err: unknown,
): err is InputValidationError => {
  // @ts-expect-error - code would exist on this one
  return err.code === "INPUT_VALIDATION_FAILED"
}
