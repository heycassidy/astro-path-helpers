import type { IntegrationResolvedRoute, RoutePart } from "astro"
import { camelCase, pascalCase } from "change-case"
import { singularize } from "inflection"

/**
 * Builds a string of the helper function name based on the route.
 *
 * This function analyzes the route segments and creates an appropriate
 * helper function name following these conventions:
 * - Root path: "rootPath"
 * - Root dynamic path: "root{DynamicPart}"
 * - Regular routes: camelCased combination of static parts with "Path" suffix
 * - Namespace routes with dynamic segments: includes dynamic part in name
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {string} The generated helper function name.
 */
export function buildHelperName(route: IntegrationResolvedRoute): string {
  const parts = route.segments.flat()

  const isRootPath = parts.length === 0
  const isRootDynamicPath = parts.length === 1 && parts[0].dynamic

  if (isRootPath) {
    return "rootPath"
  }

  if (isRootDynamicPath) {
    return camelCase(`root_${parts[0].content}`)
  }

  let functionName = ""
  let staticPartsCounter = 0
  let dynamicPartsCounter = 0

  for (const [index, part] of parts.entries()) {
    part.dynamic ? dynamicPartsCounter++ : staticPartsCounter++

    if (part.dynamic) {
      continue
    }

    const nextPart = (index < parts.length - 1 && parts[index + 1]) || undefined

    // @TODO: let users configure namespaces
    // Right now, we just assume it's a namespace if it's singular
    const isNamespacePart =
      !part.dynamic && singularize(part.content) === part.content

    // normalize parts, replace non-alpha characters with an underscore
    // so we can easily camelCase it later
    let functionNamePart = part.content.replace(/[^a-zA-Z]/g, "_")

    // Usually, you expect namespace parts to precede a static part, BUT
    // For namespace parts which precede a parameter,
    // we need to add the param to the function name
    // to avoid duplicate helper names
    //
    if (isNamespacePart && nextPart?.dynamic) {
      functionNamePart = `${functionNamePart}_${camelCase(nextPart.content)}`
    }

    // Resource part (plural)
    if (!isNamespacePart && nextPart?.dynamic) {
      functionNamePart = singularize(functionNamePart)
    }

    // append the function name part
    functionName = `${functionName}_${functionNamePart}`
  }
  functionName = camelCase(`${functionName}_path`)
  return functionName
}

/**
 * Builds a parameter list string for the helper function signature.
 *
 * @param {IntegrationResolvedRoute} route - The resolved route.
 * @returns {string} A comma-separated list of parameters with type annotations.
 */
export function buildHelperParams(route: IntegrationResolvedRoute): string {
  const params = getHelperParams(route)
  return params.map((param) => `${param}: string`).join(", ")
}

/**
 * Generates the return statement of a helper function as a string template or
 * string literal, depending on whether parameters are needed.
 *
 * For routes with dynamic segments, this creates a template literal with
 * parameter interpolation. For static routes, it creates a simple string.
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {string} The formatted return statement for the helper function.
 */
export function buildHelperPath(route: IntegrationResolvedRoute): string {
  const parts = route.segments.flat()
  const params = getHelperParams(route)

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
  const functionReturnStatement = `${quoteCharacter}${path}${quoteCharacter}`
  return functionReturnStatement
}

/**
 * Extracts a list of parameter names from the route's dynamic segments.
 *
 * This function analyzes the route structure to determine the best names
 * for parameters based on surrounding static segments:
 * - For dynamic segments with a preceding static part, it may combine them
 * - Namespace parts are handled specially to maintain intuitive naming
 * - Parameter names are camelCased for consistency
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {string[]} An array of parameter names, formatted in camelCase.
 */
function getHelperParams(route: IntegrationResolvedRoute): string[] {
  const parts = route.segments.flat()
  const dynamicParts: RoutePart[] = parts.filter((part) => part.dynamic)
  const processedParts: string[] = []

  const hasParams = dynamicParts.length > 0

  if (!hasParams) {
    return []
  }

  // @TODO: Stronger typing. We already know we don't support dynamic parts that
  // are not preceded by a static part from `isSupportedRoute` but TypeScript
  // doesn't know it yet
  for (const [index, part] of parts.entries()) {
    if (part.dynamic) {
      const prevStaticPart =
        index > 0 && !parts[index - 1].dynamic ? parts[index - 1] : undefined

      const prevStaticPartIsNamespace =
        prevStaticPart &&
        singularize(prevStaticPart.content) === prevStaticPart.content

      let processedPart = ""

      // If there's no previous static part, just camelCase the dynamic part
      if (!prevStaticPart) {
        processedPart = camelCase(part.content)
      } else {
        // Determine if we should use just the dynamic part
        // For each of these two paths, we want the param to be `projectId`
        // /projects/[projectId]
        // /projects/[id]
        const dynamicPartIncludesPrevStatic = part.content
          .toLowerCase()
          .includes(singularize(prevStaticPart.content.toLowerCase()))

        const shouldUseOnlyDynamicPart =
          prevStaticPartIsNamespace || dynamicPartIncludesPrevStatic

        if (shouldUseOnlyDynamicPart) {
          processedPart = camelCase(part.content)
        } else {
          processedPart = `${camelCase(singularize(prevStaticPart.content))}${pascalCase(part.content)}`
        }
      }

      processedParts.push(processedPart)
    }
  }

  return processedParts
}
