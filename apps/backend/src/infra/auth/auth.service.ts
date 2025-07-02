import { Result } from "@carbonteq/fp"
import { UserEntity } from "@domain/entities/user.entity"
import type { ParseError } from "effect/ParseResult"
import type { Context } from "hono"
import { injectable } from "tsyringe"
import { type AuthHandler, injectAuth } from "./better-auth"

@injectable()
export class AuthService {
  constructor(@injectAuth() private readonly auth: AuthHandler) {}

  getAuthInstance() {
    return this.auth
  }

  async getSession(headers: Headers) {
    return await this.auth.api.getSession({
      headers,
    })
  }

  async getUser(
    headers: Headers,
  ): Promise<Result<UserEntity, Error | ParseError>> {
    const session = await this.getSession(headers)
    if (!session?.user) {
      // TODO: unauthorized error
      return Result.Err(new Error("No user session found"))
    }

    const user = UserEntity.fromEncoded({
      ...session.user,
      image: session.user.image || null,
    })

    return user
  }

  requireAuth() {
    return async (c: Context, next: () => Promise<void>) => {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Authentication required" }, 401)
      }

      await next()
    }
  }

  async signOut(headers: Record<string, string | undefined>) {
    try {
      await this.auth.api.signOut({
        headers,
      })
      return true
    } catch (error) {
      console.error("Error signing out:", error)
      return false
    }
  }
}
