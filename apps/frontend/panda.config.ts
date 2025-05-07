import { defineConfig } from "@pandacss/dev"
import { createPreset } from "@park-ui/panda-preset"
import amber from "@park-ui/panda-preset/colors/amber"
import sand from "@park-ui/panda-preset/colors/sand"

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: [
    "./src/components/**/*.{ts,tsx, js, jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
  ],
  // Files to exclude
  exclude: [],
  // Useful for theme customization
  theme: {
    extend: {},
  },
  // The output directory for your css system
  outdir: "styled-system",

  jsxFramework: "react",
  presets: [
    "@pandacss/preset-base",
    createPreset({ accentColor: amber, grayColor: sand, radius: "sm" }),
  ],
})
