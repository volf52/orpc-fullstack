// Import the ApplicationResult type
import type { ApplicationResult } from "@application/utils/application-result.utils"
import { ORPCError } from "@orpc/server"

export const handleAppResult = <T>(result: ApplicationResult<T>): T => {
  if (!result.isErr()) {
    return result.unwrap()
  }

  const error = result.unwrapErr()
  const message = error.message || "An error occurred"

  switch (error.status) {
    case "NotFound":
      throw new ORPCError("NOT_FOUND", { message, status: 404 })

    case "Unauthorized":
      throw new ORPCError("UNAUTHORIZED", { message, status: 401 })

    case "Forbidden":
      throw new ORPCError("FORBIDDEN", { message, status: 403 })

    case "InvalidData":
      throw new ORPCError("BAD_REQUEST", { message, status: 400 })

    case "Conflict":
      throw new ORPCError("CONFLICT", { message, status: 409 })

    case "ExternalServiceError":
      throw new ORPCError("BAD_GATEWAY", { message, status: 502 })

    // Default case for InternalError, Generic, or unknown error types
    default:
      throw new ORPCError("INTERNAL_SERVER_ERROR", { message })
  }
}
