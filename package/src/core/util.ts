import type { RoutePart } from "astro"
import { camelize, singularize } from "inflection"

export const normalizeSegment = (
  segment: RoutePart[],
  lowFirstLetter = true,
): string => {
  // Filter out non-alphabet parts and join the remaining
  const filtered = segment
    .map((part) => part.content.replace("...", ""))
    .filter((content) => /^[a-zA-Z]+$/.test(content))
    // join underscore to support case conversion
    .join("_")

  // Return normalizedSegment or NormalizedSegment result
  return camelize(filtered, lowFirstLetter)
}

export const isStaticSegment = (segment: RoutePart[]): boolean => {
  return segment.every((part) => !part.dynamic)
}

export const isDynamicSegment = (segment: RoutePart[]): boolean => {
  return segment.some((part) => part.dynamic)
}

export const isMultiPartSegment = (segment: RoutePart[]): boolean => {
  return segment.length > 1
}

// @TODO: let users configure namespaces
// Right now, we just assume it's a namespace if it's singular
export const isNamespaceSegment = (segment: RoutePart[]): boolean => {
  return (
    isStaticSegment(segment) &&
    !isMultiPartSegment(segment) &&
    singularize(segment[0].content) === segment[0].content
  )
}
