import { writeFileSync } from "node:fs"
import type { InjectedType } from "astro"

export function injectPathHelpersTypeDeclarations(
  typeDeclarations: string,
  dir: URL,
  injectTypes?: (injectedType: InjectedType) => URL,
) {
  const typeDeclarationsPath = new URL("generated.d.ts", dir)

  if (injectTypes) {
    injectTypes({
      filename: "generated.d.ts",
      content: typeDeclarations,
    })
  } else {
    writeFileSync(typeDeclarationsPath, typeDeclarations, "utf-8")
  }
}

export function injectPathHelpers(code: string, dir: URL) {
  const codePath = new URL("generated.ts", dir)
  writeFileSync(codePath, code, "utf-8")
}
