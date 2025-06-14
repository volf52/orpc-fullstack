import { oc } from "@orpc/contract"
import { z } from "zod"

// Was good for zod v3, but not for v4 which recommends treeifyError
// https://zod.dev/error-formatting#ztreeifyerror
const zodErrorSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
})

export const appPublicBase = oc.errors({
  INPUT_VALIDATION_FAILED: {
    status: 422,
    message: "Input validation failed",

    data: zodErrorSchema,
  },
})

export const appAuthenticatedBase = appPublicBase.errors({
  // Could be due to Bearer token being not present or invalid or expired, or no user for the payload id.
  // The end user should not be shown the exact reason for better security
  // Internal logs should be used to properly identify the issue
  NotAuthenticated: {
    status: 401,
    message: "No associated user or session",
  },
})
