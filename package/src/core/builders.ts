import type { IntegrationResolvedRoute, RoutePart } from "astro"
import { camelize, singularize } from "inflection"
import type { HelperTemplateContext } from "./types.ts"
import {
  isDynamicSegment,
  isNamespaceSegment,
  isStaticSegment,
  normalizeSegment,
} from "./util.ts"

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
  const segments = route.segments
  const parts = segments.flat()

  if (parts.length === 0) {
    return "rootPath"
  }

  if (segments.length === 1 && isDynamicSegment(segments[0])) {
    return ["root", normalizeSegment(segments[0], false), "Path"].join("")
  }

  let helperNameParts = ""

  for (const [i, segment] of segments.entries()) {
    const nextSegment =
      (i < segments.length - 1 && segments[i + 1]) || undefined

    let currentSegmentName = normalizeSegment(segment)

    if (isDynamicSegment(segment)) {
      continue
    }

    // Usually, you expect namespace parts to precede a static part, BUT
    // For namespace parts which precede a parameter,
    // we need to add the param to the function name
    // to avoid duplicate helper names
    //
    if (
      isNamespaceSegment(segment) &&
      nextSegment &&
      isDynamicSegment(nextSegment)
    ) {
      currentSegmentName = [
        currentSegmentName,
        normalizeSegment(nextSegment),
      ].join("_")
    }

    if (
      !isNamespaceSegment(segment) &&
      isStaticSegment(segment) &&
      nextSegment &&
      isDynamicSegment(nextSegment)
    ) {
      currentSegmentName = singularize(currentSegmentName)
    }

    helperNameParts = [helperNameParts, currentSegmentName]
      .filter(Boolean)
      .join("_")
  }

  const functionName = camelize(`${helperNameParts}_path`, true)

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
  const segments = route.segments
  const parts = segments.flat()
  const params = getHelperParams(route)

  const dynamicParts: RoutePart[] = parts.filter((part) => part.dynamic)

  const processedSegments: string[] = []

  for (const [i, segment] of segments.entries()) {
    const processedParts: string[] = []

    for (const [_, part] of segment.entries()) {
      if (part.dynamic) {
        const dynamicPartIndex = dynamicParts.indexOf(part)

        processedParts.push(`\$\{${params[dynamicPartIndex]}\}`)
      } else {
        processedParts.push(part.content)
      }
    }

    processedSegments.push(processedParts.join(""))
  }

  return `/${processedSegments.join("/")}`
}

/**
 * Extracts a list of parameter names from the route's dynamic segments.
 *
 * This function analyzes the route structure to determine the best names
 * for parameters based on surrounding segments
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {string[]} An array of parameter names, formatted in camelCase.
 */
function getHelperParams(route: IntegrationResolvedRoute): string[] {
  const segments = route.segments
  const dynamicSegments: RoutePart[][] = segments.filter((segment) =>
    isDynamicSegment(segment),
  )

  if (dynamicSegments.length === 0) {
    return []
  }

  const processedParts: string[] = []

  for (const [i, segment] of segments.entries()) {
    const prevStaticSegment =
      i > 0 && isStaticSegment(segments[i - 1]) ? segments[i - 1] : undefined
    const nextSegment = i < segments.length - 1 ? segments[i + 1] : undefined

    // skip the segment if it's static because it don't generate params
    if (isStaticSegment(segment)) {
      continue
    }

    for (const [_, part] of segment.entries()) {
      if (!part.dynamic) {
        continue
      }

      let processedPart = camelize(part.content, true)

      const dynamicPartIncludesPrevStatic =
        prevStaticSegment &&
        part.content
          .toLowerCase()
          .includes(
            singularize(normalizeSegment(prevStaticSegment).toLowerCase()),
          )

      // Prepend the previous static segment content to the param if a bunch of conditions are true.
      // e.g. the param name for `/users/[id]` is `userId`
      if (
        // 1. This segment must follow a static segment
        prevStaticSegment &&
        // 2. The previous static segment must not be a namespace segment
        !isNamespaceSegment(prevStaticSegment) &&
        // 3. Any segment after this one must be a static segment
        (!nextSegment || (nextSegment && isStaticSegment(nextSegment))) &&
        // 4. This dynamic segment should be a single-part segment
        segment.length === 1 &&
        // 5. This dynamic part must not already include the previous static segment content
        !dynamicPartIncludesPrevStatic
      ) {
        processedPart = camelize(
          `${singularize(normalizeSegment(prevStaticSegment))}_${part.content}`,
          true,
        )
      }

      processedParts.push(processedPart)
    }
  }

  return processedParts
}

/**
 * Retrieves the components needed to generate a route helper function.
 *
 * This function returns an object containing:
 * 1. name: The helper name (e.g. "userPath")
 * 2. params: The helper parameter list (e.g. "userId: string")
 * 3. path: The dynamic path that the helper will return (e.g. "`/users/${userId}`")
 *
 * @param {IntegrationResolvedRoute} route - The route to generate helper parts for
 * @returns {HelperTemplateContext} Object containing the helper function name, parameters, and path generation code
 */
export function createTemplateContext(
  route: IntegrationResolvedRoute,
): HelperTemplateContext {
  return {
    name: buildHelperName(route),
    params: buildHelperParams(route),
    path: buildHelperPath(route),
  }
}
