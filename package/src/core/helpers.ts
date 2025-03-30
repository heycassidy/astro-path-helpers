import type { IntegrationResolvedRoute, RoutePart } from "astro"
import { camelize, capitalize, pluralize, singularize } from "inflection"

/**
 * Extracts a list of parameter names to be used in a helper function signature
 * based on the dynamic parts of the route.
 *
 * @param {RoutePart[]} parts - The parts of the route segment.
 * @returns {string[]} An array of parameter names, formatted in camelCase.
 */
export function getHelperParamsFromParts(parts: RoutePart[]): string[] {
  const dynamicParts: RoutePart[] = parts.filter((part) => part.dynamic)
  const processedParts: string[] = []

  const hasParams = dynamicParts.length > 0

  if (!hasParams) {
    return []
  }

  // @TODO: Stronger typing. We already know we don't dynamic parts are preceded
  // by a static part from `isSupportedRoute` but TypeScript doesn't know it
  for (const [index, part] of parts.entries()) {
    const prevStaticPart =
      index > 0 && !parts[index - 1].dynamic && parts[index - 1]

    if (part.dynamic) {
      let processedPart = ""

      if (prevStaticPart) {
        processedPart = `${camelize(singularize(prevStaticPart.content), true)}${camelize(part.content)}`
        // e.g. productId
      } else {
        // e.g. id
        processedPart = `${camelize(part.content, true)}`
      }

      processedParts.push(processedPart)
    }
  }

  return processedParts
}

/**
 * Generates the name of the helper function based on the route parts.
 *
 * @param {RoutePart[]} parts - The parts of the route segment.
 * @returns {string} The generated helper function name.
 */
export function getHelperNameFromParts(parts: RoutePart[]): string {
  const isRootPath = parts.length === 0

  if (isRootPath) {
    return "rootPath"
  }

  let functionName = ""
  let staticPartsCounter = 0
  let dynamicPartsCounter = 0

  for (const [index, part] of parts.entries()) {
    part.dynamic ? dynamicPartsCounter++ : staticPartsCounter++

    if (part.dynamic) {
      continue
    }

    const isFirstStaticPart = staticPartsCounter === 1
    const nextPart = index < parts.length - 1 && parts[index + 1]

    // @TODO: let users configure namespaces
    // Right now, we just assume it's a namespace if it's singular
    const isNamespacePart =
      !part.dynamic && singularize(part.content) === part.content

    // Singularize each part by default
    let functionNamePart = singularize(part.content)

    // Capitalize each part except the first
    if (!isFirstStaticPart) {
      functionNamePart = capitalize(functionNamePart)
    }

    // Pluralize the last static part if it's an index path
    if (!nextPart && !part.dynamic) {
      functionNamePart = pluralize(functionNamePart)
    }

    // Pluralize this part if:
    // 1. It's not a namespace AND
    // 2. There's a next part (this isn't the final part) AND
    // 3. The next part is static (i.e. this is a nested resource parent)
    if (!isNamespacePart && nextPart && !nextPart.dynamic) {
      functionNamePart = pluralize(functionNamePart)
    }

    // We need to add the param to the function name
    // to disambiguate namespace routes
    // Example:
    // /role/members --> roleMembersPath()
    // /role/[slug]/members --> roleSlugMembersPath(roleSlug: string)
    //
    // @TODO: maybe a better function name, like membersPathForRole(roleSlug: string)
    //
    if (isNamespacePart && nextPart && nextPart.dynamic) {
      functionNamePart = `${functionNamePart}${camelize(nextPart.content)}`
    }

    // append the function name part
    functionName = `${functionName}${functionNamePart}`
  }
  functionName = `${functionName}Path`
  return functionName
}

/**
 * Generates the return statement of a helper function as a string template or
 * string literal, depending on whether parameters are needed.
 *
 * @param {RoutePart[]} parts - The parts of the route segment.
 * @param {string[]} params - The parameter names to inject into the dynamic segments.
 * @returns {string} The formatted return statement for the helper function.
 */
export function getHelperReturnPathFromSegments(
  parts: RoutePart[],
  params: string[],
): string {
  const dynamicParts: RoutePart[] = parts.filter((part) => part.dynamic)
  const processedParts: string[] = []
  const hasParams = params.length > 0

  for (const part of parts) {
    if (part.dynamic) {
      const dynamicPartIndex = dynamicParts.indexOf(part)

      processedParts.push(`\$\{${params[dynamicPartIndex]}\}`)
    } else {
      processedParts.push(part.content)
    }
  }

  const quoteCharacter = hasParams ? "`" : '"'
  const path = `/${processedParts.join("/")}`
  const functionReturnStatement = `  return ${quoteCharacter}${path}${quoteCharacter};`
  return functionReturnStatement
}

/**
 * Determines if a given route is supported for helper generation.
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {boolean} True if the route is supported; otherwise false.
 */
export function isSupportedRoute(route: IntegrationResolvedRoute): boolean {
  // For now we only support project page routes
  if (route.type !== "page" || route.origin !== "project") {
    return false
  }

  // Don't support rest params (yet?)
  if (route.pattern.includes("...")) {
    return false
  }

  // Don't support multi-part segments (yet?)
  if (route.segments.some((segment) => segment.length > 1)) {
    return false
  }

  const parts = route.segments.flat()

  // Only support routes with dynamic parts if the dynamic part is preceded by a static part
  for (const [index, part] of parts.entries()) {
    const prevStaticPart =
      index > 0 && !parts[index - 1].dynamic && parts[index - 1]

    if (part.dynamic && !prevStaticPart) {
      // If a dynamic part is first or follows another dynamic part, return early
      return false
    }
  }

  return true
}
