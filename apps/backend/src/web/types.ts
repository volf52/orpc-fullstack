import type { ResponseHeadersPluginContext } from "@orpc/server/plugins"
import type { AuthContext } from "@/web/utils/auth-context"

export type AppContext = ResponseHeadersPluginContext & {
  auth: AuthContext // AuthContext can be null, so have to nest it to allow usage with orpc
}

export type AuthenticatedContext = AppContext & {
  auth: NonNullable<AppContext["auth"]>
}
