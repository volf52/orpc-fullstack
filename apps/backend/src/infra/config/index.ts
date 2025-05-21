import "dotenv/config"

import authConfig from "./auth.config"
import dbConfig from "./db.config"
import appConfig from "./app.config"

export default { auth: authConfig, db: dbConfig, app: appConfig }
