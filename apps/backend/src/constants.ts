import config from "./infra/config"

const baseOrigins = [
  config.app.TRUSTED_ORIGIN,
  "http://localhost:3000",
  "http://localhost:3001",
]

export const CORS_TRUSTED_ORIGINS = Array.from(new Set(baseOrigins))
