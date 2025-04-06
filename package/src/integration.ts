import { writeFileSync } from "node:fs"
import type { AstroIntegration } from "astro"
import {
  generatePathHelpers,
  generateTypeDeclarations,
} from "./core/codegen.ts"
import type { HelperRouteMap, PathHelpersOptions } from "./core/types.js"
import { isSupportedRoute } from "./core/validation.ts"
import { setupVirtualModule } from "./vite/plugin.ts"

export default function pathHelpers(
  options?: PathHelpersOptions,
): AstroIntegration {
  let helpersDir: URL
  const helperRoutes: HelperRouteMap = new Map()

  return {
    name: "astro-path-helpers",
    hooks: {
      "astro:config:setup": async ({ createCodegenDir, updateConfig }) => {
        helpersDir = createCodegenDir()

        updateConfig({
          vite: { plugins: [setupVirtualModule(helpersDir)] },
        })
      },
      "astro:routes:resolved": async ({ routes }) => {
        helperRoutes.clear()

        for (const route of routes) {
          if (!isSupportedRoute(route)) {
            continue // Silently skip unsupported routes
          }

          helperRoutes.set(route.pattern, route)
        }

        const code = generatePathHelpers(helperRoutes)
        const codePath = new URL("generated.ts", helpersDir)
        writeFileSync(codePath, "", "utf-8")
        writeFileSync(codePath, code, "utf-8")

        // re-generate types when routes change
        const typeDeclarations = generateTypeDeclarations(helperRoutes)
        const typeDeclarationsPath = new URL("generated.d.ts", helpersDir)
        writeFileSync(typeDeclarationsPath, typeDeclarations, "utf-8")
      },
      "astro:config:done": ({ injectTypes }) => {
        const typeDeclarations = generateTypeDeclarations(helperRoutes)
        injectTypes({
          filename: "generated.d.ts",
          content: typeDeclarations,
        })
      },
    },
  }
}
