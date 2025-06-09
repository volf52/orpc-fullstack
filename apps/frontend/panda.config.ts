import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  presets: ["@shadow-panda/preset"],
  jsxFramework: "react",
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/routes/**/*.{ts,tsx,js,jsx}",
    "./src/*.tsx",
  ],
  // Files to exclude
  exclude: [],
  // Useful for theme customization
  theme: {},

  // lightningcss: true,
  clean: true,
  outdir: "./styled",
})
