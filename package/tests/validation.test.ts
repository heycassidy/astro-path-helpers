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

  it("rejects route with spread part", () => {
    expect(isSupportedRoute(routeFixtures.blogSpread)).toBe(false)
  })

  it("rejects route with multi part segment", () => {
    expect(isSupportedRoute(routeFixtures.dateRangeMultiPart)).toBe(false)
  })

  it("rejects route with sequential dynamic parts", () => {
    expect(isSupportedRoute(routeFixtures.docsLangVersion)).toBe(false)
  })

  it("rejects route with dynamic part after namespace part", () => {
    expect(isSupportedRoute(routeFixtures.dashboardAuditEventDetails)).toBe(
      false,
    )
  })

  it("accepts root route", () => {
    expect(isSupportedRoute(routeFixtures.root)).toBe(true)
  })

  it("accepts root dynamic route", () => {
    expect(isSupportedRoute(routeFixtures.rootParam)).toBe(true)
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
