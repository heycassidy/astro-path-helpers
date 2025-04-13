import { writeFileSync } from "node:fs"
import type { InjectedType } from "astro"
import type { CodegenFileName } from "./types.ts"

export function injectPathHelpersTypeDeclarations(
  typeDeclarations: string,
  dir: URL,
  fileName: CodegenFileName,
  injectTypes?: (injectedType: InjectedType) => URL,
) {
  const typeDeclarationsPath = new URL(`${fileName}.d.ts`, dir)

  if (injectTypes) {
    injectTypes({
      filename: `${fileName}.d.ts`,
      content: typeDeclarations,
    })
  } else {
    writeFileSync(typeDeclarationsPath, typeDeclarations, "utf-8")
  }
}

export function injectPathHelpers(
  code: string,
  dir: URL,
  fileName: CodegenFileName,
) {
  const codePath = new URL(`${fileName}.ts`, dir)
  writeFileSync(codePath, code, "utf-8")
}
