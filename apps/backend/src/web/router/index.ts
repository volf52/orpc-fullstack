import { authenticated } from "../utils/orpc"
import userRouter from "./user"

export const router = {
  authenticated: authenticated.router({
    user: userRouter,
  }),
}

export type BackendRouter = typeof router
