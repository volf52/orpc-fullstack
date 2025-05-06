import type { DbUser } from "@/application/services/auth.service"

export interface AppContext {
  user?: DbUser
}
