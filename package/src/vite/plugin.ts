import { fileURLToPath } from "node:url"

export function setupVirtualModule(helpersDir: URL) {
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
        const generatedPath = fileURLToPath(new URL("generated.ts", helpersDir))
        return `export * from "${generatedPath}";`
      }
    },
  }
}
