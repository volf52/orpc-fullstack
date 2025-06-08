import { defineConfig } from "drizzle-kit"
import config from "./src/infra/config"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/db/schema.ts",
  out: "./migrations",
  dbCredentials: { url: config.db.DB_URL },
})
