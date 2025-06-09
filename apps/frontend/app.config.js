import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import reactRefresh from "@vitejs/plugin-react-swc"
import { createApp } from "vinxi"
import tsconfigPaths from "vite-tsconfig-paths"

export default createApp({
  server: {
    preset: "bun",
    experimental: { asyncContext: true },
  },
  routers: [
    {
      type: "static",
      name: "public",
      dir: "./public",
    },
    {
      type: "spa",
      name: "frontend",
      handler: "./index.html",
      target: "browser",
      plugins: (_opts) => {
        return [
          tsconfigPaths({}),
          TanStackRouterVite({
            target: "react",
            autoCodeSplitting: true,
            routesDirectory: "./src/routes",
            generatedRouteTree: "./src/routeTree.gen.ts",
          }),
          reactRefresh({}),
        ]
      },
    },
  ],
})
