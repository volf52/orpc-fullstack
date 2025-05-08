import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/infra/db/models/*.model.ts",
    "./src/infra/db/models/relations.ts",
  ],
  out: "./migrations",
  dbCredentials: { url: process.env.DB_URL as string },
})
