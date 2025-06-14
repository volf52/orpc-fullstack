import { ORPCError, ValidationError } from "@orpc/server"
import { ZodError, z } from "zod/v4"
import type { $ZodIssue } from "zod/v4/core"

export const validationErrMap = (err: unknown) => {
  if (!(err instanceof Error)) {
    throw err
  }

  if (!(err instanceof ORPCError)) {
    // TODO: handle non-ORPC errors
    return
  }

  if (!(err.cause instanceof ValidationError)) {
    // TODO: handle non-validation errors
    return
  }

  // https://orpc.unnoq.com/docs/advanced/validation-errors#customizing-with-middleware
  // https://orpc.unnoq.com/docs/advanced/validation-errors#type%E2%80%90safe-validation-errors
  if (err.code === "BAD_REQUEST") {
    const zodErr = new ZodError(err.cause.issues as $ZodIssue[])

    console.error("Validation error:", zodErr)

    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      cause: err.cause,
      message: "Input validation failed",
      data: z.flattenError(zodErr),
    })
  }

  if (err.code === "INTERNAL_SERVER_ERROR") {
    throw new ORPCError("OUTPUT_VALIDATION_FAILED", { cause: err.cause })
  }

  // TODO: handle other error codes
}
