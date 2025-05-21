import type { RouteConfig } from "@react-router/dev/routes"
import { flatRoutes } from "@react-router/fs-routes"

// const routes = [index("routes/home.tsx")] satisfies RouteConfig

export default flatRoutes({
  ignoredRouteFiles: [],
}) satisfies RouteConfig
