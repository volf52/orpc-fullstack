import type { Context as HonoContext } from "hono"
import type { AppContext } from "./types"
import { container } from "tsyringe"
import { AuthService } from "@/application/services/auth.service"

const authServ = container.resolve(AuthService)

export const createContext = async (c: HonoContext): Promise<AppContext> => {
  const authHeader = c.req.header("Authorization")
  if (!authHeader) {
    return {}
  }

  const [type_, token] = authHeader.split(" ")
  if (type_ !== "Bearer" || !token) {
    return {}
  }

  const payload = authServ.decodeToken(token)
  if (!payload) {
    return {}
  }
  const user = await authServ.fetchUserById(payload.id)

  if (!user) return {}

  return { user }
}
