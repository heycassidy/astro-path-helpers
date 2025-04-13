import type { AstroIntegration, IntegrationResolvedRoute } from "astro"
import { createTemplateContext } from "./core/builders.ts"
import {
  generatePathHelpers,
  generateTypeDeclarations,
} from "./core/codegen.ts"
import {
  injectPathHelpers,
  injectPathHelpersTypeDeclarations,
} from "./core/inject.ts"
import type {
  HelperTemplateContext,
  HelperTemplateContextStore,
  PathHelpersOptions,
} from "./core/types.js"
import { isSupportedRoute } from "./core/validation.ts"
import { setupVirtualModule } from "./vite/plugin.ts"

export default function pathHelpers(
  options?: PathHelpersOptions,
): AstroIntegration {
  const templateContextStore: HelperTemplateContextStore = new Map()
  let helpersDir: URL
  let addTrailingSlash = false

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
        templateContextStore.clear()

        // Process Astro Routes
        for (const route of routes) {
          if (!isSupportedRoute(route)) {
            continue // Silently skip unsupported routes
          }

          const routeTemplateContext: HelperTemplateContext =
            createTemplateContext(route)

          // Use the helper name as the key to avoid duplicate helpers
          templateContextStore.set(
            routeTemplateContext.name,
            routeTemplateContext,
          )
        }

        const code = generatePathHelpers(templateContextStore, addTrailingSlash)
        const typeDeclarations = generateTypeDeclarations(templateContextStore)

        injectPathHelpers(code, helpersDir)
        injectPathHelpersTypeDeclarations(typeDeclarations, helpersDir)
      },
      "astro:config:done": ({ injectTypes }) => {
        const typeDeclarations = generateTypeDeclarations(templateContextStore)
        injectPathHelpersTypeDeclarations(
          typeDeclarations,
          helpersDir,
          injectTypes,
        )
      },
    },
  }
}
