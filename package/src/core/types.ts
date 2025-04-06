import type { IntegrationResolvedRoute } from "astro"

export type PathHelpersOptions = Record<string, never> // no options supported yet

export type HelperRouteMap = Map<
  IntegrationResolvedRoute["pattern"],
  IntegrationResolvedRoute
>
