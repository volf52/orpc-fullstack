import { ORPCError, ValidationError } from "@orpc/server"
import { ZodError, type ZodIssue } from "zod"

export const validationErrMap = (err: unknown) => {
  if (!(err instanceof Error)) {
    throw err
  }

  if (!(err instanceof ORPCError)) {
    return
  }

  if (!(err.cause instanceof ValidationError)) {
    return
  }

  if (err.code === "BAD_REQUEST") {
    const zodErr = new ZodError(err.cause.issues as ZodIssue[])

    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      cause: err.cause,
      message: "Input validation failed",
      data: zodErr.flatten(),
    })
  }

  if (err.code === "INTERNAL_SERVER_ERROR") {
    throw new ORPCError("OUTPUT_VALIDATION_FAILED", { cause: err.cause })
  }
}
