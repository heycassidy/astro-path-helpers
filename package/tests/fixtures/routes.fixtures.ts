import type {
  IntegrationResolvedRoute,
  RouteData,
  RoutePart,
  RouteType,
} from "astro"

/**
 * Creates a mock IntegrationResolvedRoute object for testing
 */
export function createMockRoute({
  segments,
  pattern,
  type = "page",
  origin = "project",
}: {
  segments: RoutePart[][]
  pattern: string
  type?: RouteType
  origin?: RouteData["origin"]
}): IntegrationResolvedRoute {
  return {
    type,
    origin,
    segments,
    pattern,

    // Not used currently, but still required by type
    generate: () => "",
    params: [],
    patternRegex: /(?:)/,
    entrypoint: "",
    isPrerendered: false,
  }
}

export const routeFixtures = {
  serverIsland: createMockRoute({
    pattern: "/_server-islands/Avatar",
    origin: "internal",
    segments: [
      [{ content: "_server-islands", dynamic: false, spread: false }],
      [{ content: "Avatar", dynamic: false, spread: false }],
    ],
  }),

  endpoint: createMockRoute({
    pattern: "/api/users.json",
    type: "endpoint",
    segments: [
      [{ content: "api", dynamic: false, spread: false }],
      [{ content: "users.json", dynamic: false, spread: false }],
    ],
  }),

  external: createMockRoute({
    pattern: "/zap",
    origin: "external",
    segments: [[{ content: "zap", dynamic: false, spread: false }]],
  }),

  fallback: createMockRoute({
    pattern: "/es/[...slug]",
    type: "fallback",
    segments: [
      [{ content: "es", dynamic: false, spread: false }],
      [{ content: "...slug", dynamic: true, spread: true }],
    ],
  }),

  redirect: createMockRoute({
    pattern: "/old-page",
    type: "redirect",
    segments: [[{ content: "old-page", dynamic: false, spread: false }]],
  }),

  dateRangeMultiPart: createMockRoute({
    pattern: "/reports/[startDate]-to-[endDate]",
    segments: [
      [
        {
          content: "reports",
          dynamic: false,
          spread: false,
        },
      ],
      [
        {
          content: "startDate",
          dynamic: true,
          spread: false,
        },
        {
          content: "-to-",
          dynamic: false,
          spread: false,
        },
        {
          content: "endDate",
          dynamic: true,
          spread: false,
        },
      ],
    ],
  }),

  docsLangVersion: createMockRoute({
    pattern: "/docs/[lang]/[version]",
    segments: [
      [{ content: "docs", dynamic: false, spread: false }],
      [{ content: "lang", dynamic: true, spread: false }],
      [{ content: "version", dynamic: true, spread: false }],
    ],
  }),

  root: createMockRoute({
    pattern: "/",
    segments: [],
  }),

  rootParam: createMockRoute({
    pattern: "/[slug]",
    segments: [[{ content: "slug", dynamic: true, spread: false }]],
  }),

  about: createMockRoute({
    pattern: "/about",
    segments: [[{ content: "about", dynamic: false, spread: false }]],
  }),

  blog: createMockRoute({
    pattern: "/blog",
    segments: [[{ content: "blog", dynamic: false, spread: false }]],
  }),

  blogSpread: createMockRoute({
    pattern: "/blog/[...slug]",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "...slug", dynamic: true, spread: true }],
    ],
  }),

  blogPosts: createMockRoute({
    pattern: "/blog/posts",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "posts", dynamic: false, spread: false }],
    ],
  }),

  blogPostDetail: createMockRoute({
    pattern: "/blog/posts/[id]",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "posts", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
    ],
  }),

  blogAuthors: createMockRoute({
    pattern: "/blog/authors",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "authors", dynamic: false, spread: false }],
    ],
  }),

  blogAuthorDetail: createMockRoute({
    pattern: "/blog/authors/[id]",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "authors", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
    ],
  }),

  blogAuthorPosts: createMockRoute({
    pattern: "/blog/authors/[id]/posts",
    segments: [
      [{ content: "blog", dynamic: false, spread: false }],
      [{ content: "authors", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
      [{ content: "posts", dynamic: false, spread: false }],
    ],
  }),

  products: createMockRoute({
    pattern: "/products",
    segments: [[{ content: "products", dynamic: false, spread: false }]],
  }),

  productDetail: createMockRoute({
    pattern: "/products/[id]",
    segments: [
      [{ content: "products", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
    ],
  }),

  productReviews: createMockRoute({
    pattern: "/products/[id]/reviews",
    segments: [
      [{ content: "products", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
      [{ content: "reviews", dynamic: false, spread: false }],
    ],
  }),

  dashboard: createMockRoute({
    pattern: "/dashboard",
    segments: [[{ content: "dashboard", dynamic: false, spread: false }]],
  }),

  dashboardSectionI: createMockRoute({
    pattern: "/dashboard/[section]",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "section", dynamic: true, spread: false }],
    ],
  }),

  dashboardSectionII: createMockRoute({
    pattern: "/dashboard/sections/[id]",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "sections", dynamic: false, spread: false }],
      [{ content: "id", dynamic: true, spread: false }],
    ],
  }),

  dashboardUser: createMockRoute({
    pattern: "/dashboard/users/[userId]",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "users", dynamic: false, spread: false }],
      [{ content: "userId", dynamic: true, spread: false }],
    ],
  }),

  dashboardUserSettings: createMockRoute({
    pattern: "/dashboard/users/[userId]/settings",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "users", dynamic: false, spread: false }],
      [{ content: "userId", dynamic: true, spread: false }],
      [{ content: "settings", dynamic: false, spread: false }],
    ],
  }),

  dashboardProjectTaskEdit: createMockRoute({
    pattern: "/dashboard/projects/[projectId]/tasks/[taskId]/edit",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "projects", dynamic: false, spread: false }],
      [{ content: "projectId", dynamic: true, spread: false }],
      [{ content: "tasks", dynamic: false, spread: false }],
      [{ content: "taskId", dynamic: true, spread: false }],
      [{ content: "edit", dynamic: false, spread: false }],
    ],
  }),

  dashboardSettingsTab: createMockRoute({
    pattern: "/dashboard/settings/[tab]",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "settings", dynamic: false, spread: false }],
      [{ content: "tab", dynamic: true, spread: false }],
    ],
  }),

  dashboardNotificationDetails: createMockRoute({
    pattern: "/dashboard/notifications/[notificationId]/details",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "notifications", dynamic: false, spread: false }],
      [{ content: "notificationId", dynamic: true, spread: false }],
      [{ content: "details", dynamic: false, spread: false }],
    ],
  }),

  dashboardAuditEventDetails: createMockRoute({
    pattern: "/dashboard/audit/[eventId]/details",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "audit", dynamic: false, spread: false }],
      [{ content: "eventId", dynamic: true, spread: false }],
      [{ content: "details", dynamic: false, spread: false }],
    ],
  }),

  dashboardTeamMemberPermissions: createMockRoute({
    pattern: "/dashboard/teams/[teamId]/members/[memberId]/permissions",
    segments: [
      [{ content: "dashboard", dynamic: false, spread: false }],
      [{ content: "teams", dynamic: false, spread: false }],
      [{ content: "teamId", dynamic: true, spread: false }],
      [{ content: "members", dynamic: false, spread: false }],
      [{ content: "memberId", dynamic: true, spread: false }],
      [{ content: "permissions", dynamic: false, spread: false }],
    ],
  }),
}
