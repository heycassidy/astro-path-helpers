import type { RoutePart } from "astro"
import { singularize } from "inflection"

export const partIsNamespace = (part: RoutePart): boolean => {
  return !part.dynamic && singularize(part.content) === part.content
}
