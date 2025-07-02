import {
  container,
  type DependencyContainer,
  type FactoryProvider,
  inject,
  instanceCachingFactory,
} from "tsyringe"
import * as authSchema from "@/infra/db/models/auth.model"
import { resolveDbFromContainer } from "../db/conn"
import { createBetterAuthInstance } from "./create-instance"

const AuthSym = Symbol.for("AuthProvider")
export type AuthHandler = ReturnType<typeof createBetterAuthInstance>

const AuthProvider: FactoryProvider<AuthHandler> = {
  useFactory: instanceCachingFactory((container) => {
    const db = resolveDbFromContainer(container)
    const auth = createBetterAuthInstance(db, authSchema)

    return auth
  }),
}

container.register(AuthSym, AuthProvider)

export const injectAuth = () => inject(AuthSym)
export const resolveAuth = () => container.resolve(AuthSym) as AuthHandler
export const resolveAuthFromContainer = (di: DependencyContainer) =>
  di.resolve(AuthSym) as AuthHandler
