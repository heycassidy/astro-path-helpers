import { fileURLToPath } from "node:url"
import type { CodegenFileName } from "../core/types.ts"

export function setupVirtualModule(helpersDir: URL, fileName: CodegenFileName) {
  const virtualModuleId = "virtual:astro-path-helpers"
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: "astro-path-helpers-virtual-module",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const generatedPath = fileURLToPath(
          new URL(`${fileName}.ts`, helpersDir),
        )
        return `export * from "${generatedPath}";`
      }
    },
  }
}
