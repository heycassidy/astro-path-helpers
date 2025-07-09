import type { IntegrationResolvedRoute } from "astro"
import { describe, expect, test } from "vitest"
import {
  buildHelperName,
  buildHelperParams,
  buildHelperPath,
} from "../src/core/builders"
import { routeFixtures } from "./fixtures/routes.fixtures"

// biome-ignore format: keep arrays formatted as is
const routeFixtureToExpectedPartsMap = {
  root: [
    'rootPath',
    '',
    '/',
  ],

  rootParam: [
    'slugPath',
    'slug: string',
    '/${slug}',
  ],

  rootMultiPart: [
    'dateSlugPath',
    'date: string, slug: string',
    '/${date}-${slug}',
  ],

  localeSlug: [
    'localePath',
    'locale: string, slug: string[]',
    '/${locale}/${slug.join("/")}',
  ],

  localeSlugDoubleSpread: [
    'localePath',
    'locale: string[], slug: string[]',
    '/${locale.join("/")}/${slug.join("/")}',
  ],

  localeVersionDocsTopic: [
    'localeDocPath',
    'locale: string, version: string, docTopic: string[]',
    '/${locale}/${version}/docs/${docTopic.join("/")}',
  ],

  about: [
    'aboutPath',
    '',
    '/about',
  ],

  blog: [
    'blogPath',
    '',
    '/blog',
  ],

  blogPosts: [
    'blogPostsPath',
    '',
    '/blog/posts',
  ],

  blogPostDetail: [
    'blogPostPath',
    'postId: string',
    '/blog/posts/${postId}',
  ],

  blogAuthors: [
    'blogAuthorsPath',
    '',
    '/blog/authors',
  ],

  blogAuthorDetail: [
    'blogAuthorPath',
    'authorId: string',
    '/blog/authors/${authorId}',
  ],

  blogAuthorPosts: [
    'blogAuthorPostsPath',
    'authorId: string',
    '/blog/authors/${authorId}/posts',
  ],

  products: [
    'productsPath',
    '',
    '/products',
  ],

  productDetail: [
    'productPath',
    'productId: string',
    '/products/${productId}',
  ],

  productVariantDetail: [
    'productPath',
    'id: string, variant: string',
    '/products/${id}-${variant}',
  ],

  productReviews: [
    'productReviewsPath',
    'productId: string',
    '/products/${productId}/reviews',
  ],

  productsCategories: [
    'productsCategoriesPath',
    '',
    '/products/categories'
  ],

  dashboard: [
    'dashboardPath',
    '',
    '/dashboard',
  ],

  dashboardSectionI: [
    'dashboardSectionPath',
    'sectionId: string',
    '/dashboard/sections/${sectionId}',
  ],

  dashboardSectionII: [
    'dashboardSectionPath',
    'section: string',
    '/dashboard/${section}',
  ],

  dashboardUser: [
    'dashboardUserPath',
    'userId: string',
    '/dashboard/users/${userId}',
  ],

  dashboardUserSettings: [
    'dashboardUserSettingsPath',
    'userId: string',
    '/dashboard/users/${userId}/settings',
  ],

  dashboardProjectTaskEdit: [
    'dashboardProjectTaskEditPath',
    'projectId: string, taskId: string',
    '/dashboard/projects/${projectId}/tasks/${taskId}/edit',
  ],

  dashboardSettingsTab: [
    'dashboardSettingPath',
    'settingTab: string',
    '/dashboard/settings/${settingTab}',
  ],

  dashboardNotificationDetails: [
    'dashboardNotificationDetailsPath',
    'notificationId: string',
    '/dashboard/notifications/${notificationId}/details',
  ],

  dashboardTeamMemberPermissions: [
    'dashboardTeamMemberPermissionsPath',
    'teamId: string, memberId: string',
    '/dashboard/teams/${teamId}/members/${memberId}/permissions',
  ],

  dateRangeMultiPart: [
    'reportPath',
    'startDate: string, endDate: string',
    '/reports/${startDate}-to-${endDate}'
  ],

  docsLangVersion: [
    'docPath',
    'lang: string, version: string',
    '/docs/${lang}/${version}',
  ],

}

describe("buildHelperName", () => {
  const testCases: Array<[string, string, IntegrationResolvedRoute]> =
    Object.entries(routeFixtureToExpectedPartsMap).map(
      ([fixtureName, expectedHelperParts]) => [
        routeFixtures[fixtureName].pattern,
        expectedHelperParts[0],
        routeFixtures[fixtureName],
      ],
    )

  test.each(testCases)("%s --> %s", (pattern, expected, route) => {
    const actual = buildHelperName(route)
    expect(actual).toBe(expected)
  })
})

describe("buildHelperParams", () => {
  const testCases: Array<[string, string, IntegrationResolvedRoute]> =
    Object.entries(routeFixtureToExpectedPartsMap).map(
      ([fixtureName, expectedHelperParts]) => [
        routeFixtures[fixtureName].pattern,
        expectedHelperParts[1],
        routeFixtures[fixtureName],
      ],
    )

  test.each(testCases)("%s --> %s", (pattern, expected, route) => {
    const actual = buildHelperParams(route)
    expect(actual).toBe(expected)
  })
})

describe("buildHelperPath", () => {
  const testCases: Array<[string, string, IntegrationResolvedRoute]> =
    Object.entries(routeFixtureToExpectedPartsMap).map(
      ([fixtureName, expectedHelperParts]) => [
        routeFixtures[fixtureName].pattern,
        expectedHelperParts[2],
        routeFixtures[fixtureName],
      ],
    )

  test.each(testCases)("%s --> %s", (pattern, expected, route) => {
    const actual = buildHelperPath(route)
    expect(actual).toBe(expected)
  })
})
