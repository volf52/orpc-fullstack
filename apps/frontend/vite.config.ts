import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import tsConfigPaths from "vite-tsconfig-paths"

const cssTransformer = "lightningcss" as const

export default defineConfig(() => {
  return {
    // Native plugins mess with css for now
    // experimental: { enableNativePlugin: true },

    css: { transformer: cssTransformer }, // might cause issues for postcss specific stuff
    build: { cssMinify: cssTransformer },
    server: { port: 3000 },
    plugins: [
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        tsr: { target: "react" },
        react: { disableOxcRecommendation: false },
        sitemap: { enabled: false },

        // target: "bun",
      }),
      Inspect({
        dev: false,
        build: true,
        embedded: false,
        exclude: [/node_modules/],
      }),
    ],
  }
})
