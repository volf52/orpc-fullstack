import { oc } from "@orpc/contract"
import z from "zod"

export const appPublicBase = oc.errors({
  INPUT_VALIDATION_FAILED: {
    status: 422,
    message: "Input validation failed",
    data: z.object({
      formErrors: z.array(z.string()),
      fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
    }),
  },
})

export const appAuthenticatedBase = appPublicBase.errors({
  // Could be due to Bearer token being not present or invalid or expired, or no user for the payload id.
  // The end user should not be shown the exact reason for better security
  // Internal logs should be used to properly identify the issue
  NO_USER: {
    status: 401,
    message: "No associated user",
  },
})
