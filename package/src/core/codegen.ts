import type { IntegrationResolvedRoute } from "astro"
import type {
  HelperTemplateContext,
  HelperTemplateContextStore,
} from "./types.ts"

/**
 * Generates the source code for all path helpers based on the provided template context store
 *
 * @param {HelperTemplateContextStore} templateContextStore - A map of template context objects
 * @param {boolean} addTrailingSlash - Whether to add a trailing slash to the generated paths.
 * @returns {string} The generated source code as a string.
 */
export function generatePathHelpers(
  templateContextStore: HelperTemplateContextStore,
  addTrailingSlash: boolean,
): string {
  const lines: string[] = [
    "// This file is auto-generated by astro-path-helpers",
    "// Do not edit manually",
    "",
  ]

  for (const templateContext of templateContextStore.values()) {
    const { name, params, path }: HelperTemplateContext = templateContext

    const hasParams = params.length > 0
    const quoteCharacter = hasParams ? "`" : '"'

    lines.push(`export function ${name}(${params}): string {`)
    lines.push(
      `  return ${quoteCharacter}${path}${addTrailingSlash ? "/" : ""}${quoteCharacter};`,
    )
    lines.push("}")
    lines.push("")
  }

  return lines.join("\n")
}

/**
 * Generates TypeScript declaration source for all path helpers based on the provided template context store
 *
 * @param {HelperTemplateContextStore} templateContextStore - A map of template context objects
 * @returns {string} The TypeScript declaration content as a string.
 */
export function generateTypeDeclarations(
  templateContextStore: HelperTemplateContextStore,
): string {
  const lines: string[] = [
    "// This file is auto-generated by astro-path-helpers",
    "// Do not edit manually",
    "",
    "declare module 'astro-path-helpers' {",
    "",
  ]

  for (const templateContext of templateContextStore.values()) {
    const { name, params }: HelperTemplateContext = templateContext

    lines.push(`  export function ${name}(${params}): string`)
    lines.push("")
  }

  lines.push("}")

  return lines.join("\n")
}
