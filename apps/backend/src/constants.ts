import config from "./infra/config"

const baseOrigins = [
  config.app.TRUSTED_ORIGIN,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8000",
  "http://localhost:8001",
]

export const CORS_TRUSTED_ORIGINS = Array.from(new Set(baseOrigins))

export const IS_DEV = config.app.NODE_ENV === "development"
export const IS_PROD = config.app.NODE_ENV === "production"
