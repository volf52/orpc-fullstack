import { betterAuth, type Session, type User } from "better-auth"
import { openAPI } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  container,
  type DependencyContainer,
  instanceCachingFactory,
} from "tsyringe"
import * as authSchema from "@/infra/db/models/auth.model"
import { resolveDbFromContainer } from "../db/conn"
import config from "../config"

const AuthSym = Symbol.for("AuthProvider")

// type InferredAuth = AuthHandler["$Infer"]["Session"]

export type AuthType = {
  Variables: {
    user: User
    session: Session
    // user: InferredAuth["user"]
    // session: InferredAuth["session"]
  }
}

const AuthProvider = {
  useFactory: instanceCachingFactory((container) => {
    const db = resolveDbFromContainer(container)
    const auth = betterAuth({
      database: drizzleAdapter(db, {
        schema: authSchema,
        provider: "pg",
      }),
      emailAndPassword: { enabled: true },
      appName: "Carbonteq Starter",
      trustedOrigins: [config.app.TRUSTED_ORIGIN, "http://localhost:3000"],
      plugins: [openAPI({ disableDefaultReference: true })],
      session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
      advanced: { database: { generateId: false } },
    })

    return auth
  }),
}

type AuthHandler = ReturnType<typeof AuthProvider.useFactory>

container.register(AuthSym, AuthProvider)
export const resolveAuth = () => container.resolve(AuthSym) as AuthHandler
export const resolveAuthFromContainer = (di: DependencyContainer) =>
  di.resolve(AuthSym) as AuthHandler
