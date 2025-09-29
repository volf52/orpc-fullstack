import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import tsConfigPaths from "vite-tsconfig-paths"

const cssTransformer = "lightningcss" as const

export default defineConfig(({ mode }) => {
  return {
    // Native plugins mess with css for now
    // experimental: { enableNativePlugin: true },

    css: { transformer: cssTransformer }, // might cause issues for postcss specific stuff
    build: { cssMinify: cssTransformer },
    dev: {},
    server: {
      cors: mode === "development",
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: mode === "development" ? true : undefined,
    },
    // oxc: {},
    plugins: [
      devtools(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      viteReact({}),
      tanstackStart({}),
      Inspect({
        dev: false,
        build: true,
        embedded: false,
        exclude: [/node_modules/],
      }),
    ],
  }
})
