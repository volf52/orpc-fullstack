import {
  CORSPlugin,
  ResponseHeadersPlugin,
  StrictGetMethodPlugin,
} from "@orpc/server/plugins"
import type { AppContext } from "@web/types"

export const commonPlugins = [
  new StrictGetMethodPlugin<AppContext>(),
  new CORSPlugin<AppContext>({
    origin: (origin, _opts) => origin,
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
  }),
  new ResponseHeadersPlugin<AppContext>(),
] as const
