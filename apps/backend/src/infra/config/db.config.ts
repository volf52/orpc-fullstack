import "dotenv/config"
import * as env from "env-var"

const DB_URL = env.get("DB_URL").required().asString()

const dbConfig = { DB_URL } as const

export default dbConfig
