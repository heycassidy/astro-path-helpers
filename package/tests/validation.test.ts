import type { IntegrationResolvedRoute } from "astro"
import { describe, expect, it } from "vitest"
import { isSupportedRoute } from "../src/core/validation"
import { routeFixtures } from "./fixtures/routes.fixtures"

describe("isSupportedRoute", () => {
  it("rejects internal route", () => {
    expect(isSupportedRoute(routeFixtures.serverIsland)).toBe(false)
  })

  it("rejects external route", () => {
    expect(isSupportedRoute(routeFixtures.external)).toBe(false)
  })

  it("rejects endpoint route", () => {
    expect(isSupportedRoute(routeFixtures.endpoint)).toBe(false)
  })

  it("rejects redirect route", () => {
    expect(isSupportedRoute(routeFixtures.redirect)).toBe(false)
  })

  it("rejects fallback route", () => {
    expect(isSupportedRoute(routeFixtures.fallback)).toBe(false)
  })

  it("rejects route with a dynamic part preceded by another identical dynamic part", () => {
    expect(isSupportedRoute(routeFixtures.duplicateConsecutiveParams)).toBe(
      false,
    )
  })

  it("accepts route with spread part", () => {
    expect(isSupportedRoute(routeFixtures.blogSpread)).toBe(true)
  })

  it("accepts route with dynamic part after namespace part", () => {
    expect(isSupportedRoute(routeFixtures.dashboardAuditEventDetails)).toBe(
      true,
    )
  })

  it("accepts route with dynamic segment after namespace segment", () => {
    expect(isSupportedRoute(routeFixtures.namespaceDateRangeMultiPart)).toBe(
      true,
    )
  })

  it("accepts route with multi part segment", () => {
    expect(isSupportedRoute(routeFixtures.dateRangeMultiPart)).toBe(true)
  })

  it("accepts route with consecutive dynamic parts", () => {
    expect(isSupportedRoute(routeFixtures.docsLangVersion)).toBe(true)
  })

  it("accepts root route", () => {
    expect(isSupportedRoute(routeFixtures.root)).toBe(true)
  })

  it("accepts root dynamic route", () => {
    expect(isSupportedRoute(routeFixtures.rootParam)).toBe(true)
  })

  it("accepts root multi-part route", () => {
    expect(isSupportedRoute(routeFixtures.rootMultiPart)).toBe(true)
  })

  it("accepts simple static route", () => {
    expect(isSupportedRoute(routeFixtures.about)).toBe(true)
  })

  it("accepts route with one dynamic part preceded by static part", () => {
    expect(isSupportedRoute(routeFixtures.productDetail)).toBe(true)
  })

  it("accepts route with dynamic part in the middle", () => {
    expect(isSupportedRoute(routeFixtures.productReviews)).toBe(true)
  })
})
