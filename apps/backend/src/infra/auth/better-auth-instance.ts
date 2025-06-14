import { resolveDbFromContainer } from "@infra/db/conn"
import { container } from "tsyringe"
import { createBetterAuthInstance } from "./create-instance"

// For schema generation, needs testing as @btter-auth/cli is not working
const db = resolveDbFromContainer(container)
const betterAuthInstance = createBetterAuthInstance(db)

export default betterAuthInstance
