import { betterAuth, type Session, type User } from "better-auth"
import { openAPI } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  container,
  type DependencyContainer,
  instanceCachingFactory,
  type FactoryProvider,
} from "tsyringe"
import * as authSchema from "@/infra/db/models/auth.model"
import { resolveDbFromContainer } from "../db/conn"

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
      plugins: [openAPI({ disableDefaultReference: true })],
    })

    return auth
  }),
}

type AuthHandler = ReturnType<typeof AuthProvider.useFactory>

container.register(AuthSym, AuthProvider)
export const resolveAuth = () => container.resolve(AuthSym) as AuthHandler
export const resolveAuthFromContainer = (di: DependencyContainer) =>
  di.resolve(AuthSym) as AuthHandler
