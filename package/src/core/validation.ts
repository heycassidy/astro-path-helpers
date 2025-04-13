import type { IntegrationResolvedRoute } from "astro"
import { partIsNamespace } from "./util.ts"

/**
 * Determines if a given route is supported for helper generation.
 *
 * This function applies several criteria to filter out routes that cannot
 * be properly handled by the helper generation system:
 * - Only project page routes are supported
 * - Routes with rest parameters are not supported
 * - Multi-part segments are not supported
 * - Sequential dynamic parts are not supported
 *
 * @param {IntegrationResolvedRoute} route - The resolved route to check.
 * @returns {boolean} True if the route is supported; otherwise false.
 */
export function isSupportedRoute(route: IntegrationResolvedRoute): boolean {
  const parts = route.segments.flat()

  // For now we only support project page routes
  if (route.type !== "page" || route.origin !== "project") {
    return false
  }

  // Don't support rest params (yet?)
  if (parts.some((part) => part.spread)) {
    return false
  }

  // Don't support multi-part segments (yet?)
  if (route.segments.some((segment) => segment.length > 1)) {
    return false
  }

  // Reject routes that have a dynamic part preceded by another dynamic part
  for (const [index, part] of parts.entries()) {
    const prevPart = parts[index - 1]

    if (part.dynamic && prevPart?.dynamic) {
      return false
    }
  }

  return true
}
