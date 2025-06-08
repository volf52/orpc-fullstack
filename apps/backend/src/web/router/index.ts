import { authenticated } from "../utils/orpc"
import { whoamiHandler } from "./auth"

export const router = {
  authenticated: authenticated.router({
    auth: { whoami: whoamiHandler },
  }),
}

export type BackendRouter = typeof router
