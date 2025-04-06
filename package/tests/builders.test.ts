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
    '"/"',
  ],

  rootParam: [
    'rootSlug',
    'slug: string',
    '`/${slug}`',
  ],

  about: [
    'aboutPath',
    '',
    '"/about"',
  ],

  blog: [
    'blogPath',
    '',
    '"/blog"',
  ],

  blogPosts: [
    'blogPostsPath',
    '',
    '"/blog/posts"',
  ],

  blogPostDetail: [
    'blogPostPath',
    'postId: string',
    '`/blog/posts/${postId}`',
  ],

  blogAuthors: [
    'blogAuthorsPath',
    '',
    '"/blog/authors"',
  ],

  blogAuthorDetail: [
    'blogAuthorPath',
    'authorId: string',
    '`/blog/authors/${authorId}`',
  ],

  blogAuthorPosts: [
    'blogAuthorPostsPath',
    'authorId: string',
    '`/blog/authors/${authorId}/posts`',
  ],

  products: [
    'productsPath',
    '',
    '"/products"',
  ],

  productDetail: [
    'productPath',
    'productId: string',
    '`/products/${productId}`',
  ],

  productReviews: [
    'productReviewsPath',
    'productId: string',
    '`/products/${productId}/reviews`',
  ],

  dashboard: [
    'dashboardPath',
    '',
    '"/dashboard"',
  ],

  // @TODO: These two dashboard section tests show how two different paths
  // can still generate the same helper name
  dashboardSectionI: [
    'dashboardSectionPath',
    'section: string',
    '`/dashboard/${section}`',
  ],

  dashboardSectionII: [
    'dashboardSectionPath',
    'sectionId: string',
    '`/dashboard/sections/${sectionId}`',
  ],

  dashboardUser: [
    'dashboardUserPath',
    'userId: string',
    '`/dashboard/users/${userId}`',
  ],

  dashboardUserSettings: [
    'dashboardUserSettingsPath',
    'userId: string',
    '`/dashboard/users/${userId}/settings`',
  ],

  dashboardProjectTaskEdit: [
    'dashboardProjectTaskEditPath',
    'projectId: string, taskId: string',
    '`/dashboard/projects/${projectId}/tasks/${taskId}/edit`',
  ],

  dashboardSettingsTab: [
    'dashboardSettingPath',
    'settingTab: string',
    '`/dashboard/settings/${settingTab}`',
  ],

  dashboardNotificationDetails: [
    'dashboardNotificationDetailsPath',
    'notificationId: string',
    '`/dashboard/notifications/${notificationId}/details`',
  ],

  dashboardAuditEventDetails: [
    'dashboardAuditEventIdDetailsPath',
    'eventId: string',
    '`/dashboard/audit/${eventId}/details`',
  ],

  dashboardTeamMemberPermissions: [
    'dashboardTeamMemberPermissionsPath',
    'teamId: string, memberId: string',
    '`/dashboard/teams/${teamId}/members/${memberId}/permissions`',
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
