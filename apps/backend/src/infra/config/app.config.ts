import "dotenv/config"
import * as env from "env-var"

const PORT = env.get("PORT").default(8000).asPortNumber()
const NODE_ENV = env
  .get("NODE_ENV")
  .default("development")
  .asEnum(["development", "production", "testing"] as const)

const TRUSTED_ORIGIN = env
  .get("TRUSTED_ORIGIN")
  .default("http://localhost:3000")
  .asString()

export default { PORT, NODE_ENV, TRUSTED_ORIGIN } as const
