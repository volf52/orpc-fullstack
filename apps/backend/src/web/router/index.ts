import { authenticated, contractRouter } from "../utils/orpc"
import groceryListRouter from "./grocery-list"
import userRouter from "./user"

export const router = {
  authenticated: authenticated.router({
    user: userRouter,
    groceryList: groceryListRouter,
  }),
}

export type BackendRouter = typeof router
