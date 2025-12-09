import {
  ResponseHeadersPlugin,
  StrictGetMethodPlugin,
} from "@orpc/server/plugins"
import type { AppContext } from "@web/types"

export const commonPlugins = [
  new StrictGetMethodPlugin<AppContext>(),
  // let elysia or hono or whatever underlying system you are using handle CORS
  // new CORSPlugin<AppContext>({
  //   // origin: (origin, _opts) => origin,
  //   // allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
  // }),
  new ResponseHeadersPlugin<AppContext>(),
] as const
