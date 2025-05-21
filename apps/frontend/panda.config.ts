import { defineConfig } from "@pandacss/dev"
import { createPreset } from "@park-ui/panda-preset"
import amber from "@park-ui/panda-preset/colors/amber"
import sand from "@park-ui/panda-preset/colors/sand"
import sage from "@park-ui/panda-preset/colors/sage"
import teal from "@park-ui/panda-preset/colors/teal"

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: [
    "./app/components/**/*.{ts,tsx, js, jsx}",
    "./app/routes/**/*.{ts,tsx,js,jsx}",
    "./app/root.tsx",
  ],
  // Files to exclude
  exclude: [],
  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          red: { value: "#EE0F0F" },
          green: { value: "#0FEE0F" },
        },
      },
      semanticTokens: {
        colors: {
          danger: { value: "{colors.red}" },
          success: { value: "{colors.green}" },
        },
      },
    },
  },
  // The output directory for your css system
  outdir: "styled-system",

  jsxFramework: "react",
  presets: [
    "@pandacss/preset-base",
    createPreset({ accentColor: teal, grayColor: sage, radius: "sm" }),
  ],
})
