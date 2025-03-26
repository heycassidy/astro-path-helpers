import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import type { AstroIntegration } from "astro"
import { generatePathHelpers, generateTypeDeclarations } from "./codegen.js"

function setupVirtualModule(helpersDir: URL) {
  const virtualModuleId = "virtual:astro-path-helpers"
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: "astro-path-helpers-virtual",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const generatedPath = fileURLToPath(new URL("generated.ts", helpersDir))
        return `export * from "${generatedPath}";`
      }
    },
  }
}

export interface ResourceConfig {
  name: string // plural
  path?: string // optional override
}

export interface PathHelpersOptions {
  resources: ResourceConfig[]
}

export default function pathHelpers(
  options: PathHelpersOptions,
): AstroIntegration {
  console.log("PathHelpers integration initialized with options:", options)

  let helpersDir: URL

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
        const code = generatePathHelpers(options.resources)
        const filePath = new URL("generated.ts", helpersDir)
        writeFileSync(filePath, code, "utf-8")
      },
      "astro:config:done": ({ injectTypes }) => {
        const typeDeclarations = generateTypeDeclarations(options.resources)

        injectTypes({
          filename: "generated.d.ts",
          content: typeDeclarations,
        })
      },
    },
  }
}
