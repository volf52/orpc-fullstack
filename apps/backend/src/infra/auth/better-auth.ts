import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { openAPI } from "better-auth/plugins"
import {
  container,
  type DependencyContainer,
  instanceCachingFactory,
} from "tsyringe"
import * as authSchema from "@/infra/db/models/auth.model"
import config from "../config"
import { resolveDbFromContainer } from "../db/conn"

const AuthSym = Symbol.for("AuthProvider")

const AuthProvider = {
  useFactory: instanceCachingFactory((container) => {
    const db = resolveDbFromContainer(container)
    const auth = betterAuth({
      database: drizzleAdapter(db, {
        schema: authSchema,
        provider: "pg",
      }),

      emailAndPassword: {
        enabled: true,
        password: {
          hash: (password) =>
            Bun.password.hash(password, { algorithm: "argon2id" }),
          verify: ({ password, hash }) =>
            Bun.password.verify(password, hash, "argon2id"),
        },
      },
      appName: config.app.APP_NAME,
      trustedOrigins: [config.app.TRUSTED_ORIGIN, "http://localhost:3000"],
      plugins: [openAPI({ disableDefaultReference: true })],
      session: { cookieCache: { enabled: true, maxAge: 60 * 5 } }, // check session in database every 5 minutes
      advanced: { database: { generateId: false } },
    })

    return auth
  }),
}

export type AuthHandler = ReturnType<typeof AuthProvider.useFactory>

container.register(AuthSym, AuthProvider)
export const resolveAuth = () => container.resolve(AuthSym) as AuthHandler
export const resolveAuthFromContainer = (di: DependencyContainer) =>
  di.resolve(AuthSym) as AuthHandler
