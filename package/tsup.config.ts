import { defineConfig } from "tsup"
import { peerDependencies } from "./package.json"

export default defineConfig((options) => {
  const dev = !!options.watch
  return {
    entry: {
      index: "src/index.ts",
      generated: "src/generated.ts",
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: !dev,
    external: [
      ...Object.keys(peerDependencies),
      "virtual:astro-path-helpers", // Add the virtual module to external
    ],
    tsconfig: "tsconfig.json",
  }
})
