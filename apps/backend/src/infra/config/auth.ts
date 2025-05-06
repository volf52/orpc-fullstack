import "dotenv/config"
import * as env from "env-var"

const HASH_SECRET = env.get("HASH_SECRET").required().asString()
const JWT_SECRET = env.get("JWT_SECRET").required().asString()
const DOCS_AUTH_PASS = env.get("DOCS_AUTH_PASS").required().asString()

export default { HASH_SECRET, JWT_SECRET, DOCS_AUTH_PASS }
