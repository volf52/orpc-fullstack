import { defineConfig } from "drizzle-kit"
import config from "./src/infra/config"

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/infra/db/models/*.model.ts",
    "./src/infra/db/models/relations.ts",
  ],
  out: "./migrations",
  dbCredentials: { url: config.db.DB_URL },
})
