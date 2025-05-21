import config from "@/infra/config"
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import {
  container,
  type DependencyContainer,
  type FactoryProvider,
  inject,
  instanceCachingFactory,
} from "tsyringe"

const dbConnFactory = () => {
  const pool = new Pool({
    connectionString: config.db.DB_URL,
    max: 25,
  })

  const db = drizzle(pool, {
    logger: config.app.NODE_ENV === "DEV",
  })

  return db
}

const DbSym = Symbol.for("Database")
export type Database = NodePgDatabase

export const DbProvider: FactoryProvider<Database> = {
  useFactory: instanceCachingFactory(dbConnFactory),
}

container.register(DbSym, DbProvider)

export const InjectDb = () => inject(DbSym)
export const resolveDb = () => container.resolve(DbSym) as Database
export const resolveDbFromContainer = (depcontainer: DependencyContainer) =>
  depcontainer.resolve(DbSym) as Database
