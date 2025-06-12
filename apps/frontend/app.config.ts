import { defineConfig } from "@tanstack/react-start/config"
import Inspect from "vite-plugin-inspect"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  tsr: {
    appDirectory: "./src",
  },
  // server: { preset: "bun" },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      Inspect({
        build: true,
        dev: false,
        embedded: false,
        exclude: [/node_modules/],
      }),
    ],
  },
})
