import type { AuthContext } from "@/web/utils/context"

export type AppContext = {
  auth: AuthContext // AuthContext can be null, so have to nest it to allow usage with orpc
}
