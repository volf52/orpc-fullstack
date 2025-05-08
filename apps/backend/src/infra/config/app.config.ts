import "dotenv/config"
import * as env from "env-var"

const PORT = env.get("PORT").default(8000).asPortNumber()
const NODE_ENV = env
  .get("NODE_ENV")
  .default("DEV")
  .asEnum(["DEV", "PROD"] as const)

export default { PORT, NODE_ENV } as const
