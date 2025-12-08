import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
// import Inspect from "vite-plugin-inspect"
import tsConfigPaths from "vite-tsconfig-paths"

const cssTransformer = "lightningcss" as const

export default defineConfig(({ mode }) => {
  return {
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
    plugins: [
      devtools(),
      nitro({ preset: "bun" }),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({}),
      viteReact({
        babel: { plugins: ["babel-plugin-react-compiler"] },
      }),
      // Inspect({
      //   dev: false,
      //   build: true,
      //   embedded: false,
      //   exclude: [/node_modules/],
      // }),
    ],
  }
})
