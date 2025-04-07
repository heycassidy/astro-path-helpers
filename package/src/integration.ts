import type { AstroIntegration } from "astro"
import {
  generatePathHelpers,
  generateTypeDeclarations,
} from "./core/codegen.ts"
import {
  injectPathHelpers,
  injectPathHelpersTypeDeclarations,
} from "./core/inject.ts"
import type { HelperRouteMap, PathHelpersOptions } from "./core/types.js"
import { isSupportedRoute } from "./core/validation.ts"
import { setupVirtualModule } from "./vite/plugin.ts"

export default function pathHelpers(
  options?: PathHelpersOptions,
): AstroIntegration {
  let helpersDir: URL
  let addTrailingSlash = false
  const helperRoutes: HelperRouteMap = new Map()

  return {
    name: "astro-path-helpers",
    hooks: {
      "astro:config:setup": async ({
        createCodegenDir,
        updateConfig,
        config,
      }) => {
        helpersDir = createCodegenDir()
        addTrailingSlash = config.trailingSlash === "always"

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

        const code = generatePathHelpers(helperRoutes, addTrailingSlash)
        const typeDeclarations = generateTypeDeclarations(helperRoutes)

        injectPathHelpers(code, helpersDir)
        injectPathHelpersTypeDeclarations(typeDeclarations, helpersDir)
      },
      "astro:config:done": ({ injectTypes }) => {
        const typeDeclarations = generateTypeDeclarations(helperRoutes)
        injectPathHelpersTypeDeclarations(typeDeclarations, helpersDir)
      },
    },
  }
}
