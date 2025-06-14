import { NewUserSchema } from "@contract/schemas/user"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { openAPI } from "better-auth/plugins"
import {
  container,
  type DependencyContainer,
  instanceCachingFactory,
} from "tsyringe"
import { z } from "zod/v4"
import * as authSchema from "@/infra/db/models/auth.model"
import config from "../config"
import { resolveDbFromContainer } from "../db/conn"

const AuthSym = Symbol.for("AuthProvider")

const beforeHooks = createAuthMiddleware(async (ctx) => {
  console.debug("beforeHooks: request received", ctx.path)
  if (ctx.path === "/sign-up/email") {
    console.debug("beforeHooks: sign-up request", ctx.body)

    const validationResult = NewUserSchema.safeParse(ctx.body)

    if (!validationResult.success) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        code: "INPUT_VALIDATION_FAILED",
        message: "Input validation failed",
        data: z.flattenError(validationResult.error),
      })
    }
  }
})

const AuthProvider = {
  useFactory: instanceCachingFactory((container) => {
    const db = resolveDbFromContainer(container)
    const auth = betterAuth({
      basePath: "/auth",
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
      // https://www.better-auth.com/docs/guides/optimizing-for-performance#cookie-cache
      session: { cookieCache: { enabled: true, maxAge: 60 * 5 } }, // check session in database every 5 minutes
      advanced: { database: { generateId: false } }, // generate uuids via drizzle

      // https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
      hooks: {
        before: beforeHooks,
      },
    })

    return auth
  }),
}

export type AuthHandler = ReturnType<typeof AuthProvider.useFactory>

container.register(AuthSym, AuthProvider)
export const resolveAuth = () => container.resolve(AuthSym) as AuthHandler
export const resolveAuthFromContainer = (di: DependencyContainer) =>
  di.resolve(AuthSym) as AuthHandler
