# Astro Path Helpers

This [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) generates type-safe path helper functions for your [Astro](https://astro.build/) routes.

- <strong>[Why Astro Path Helpers](#why-astro-path-helpers)</strong>
- <strong>[Installation](#installation)</strong>
- <strong>[Usage](#usage)</strong>
- <strong>[Configuration](#configuration)</strong>
- <strong>[Examples](#examples)</strong>
- <strong>[Limitations](#limitations)</strong>
- <strong>[Roadmap](#roadmap)</strong>
- <strong>[Changelog](#changelog)</strong>

## Why Astro Path Helpers

When building content-oriented sites, you frequently need to link between pages. Standard Astro doesn't provide a type-safe method for this, leaving you with plain text paths that are prone to typos and difficult to maintain when route structures change.

Astro Path Helpers solves this problem by automatically generating a named type-safe, helper function for each route in your project.

For example, instead of writing:
```astro
<a href="/posts/my-post">My Post</a>
```

You can use the generated helper:
```astro
<a href={postPath('my-post')}>My Post</a>
```

## Installation

### Quick Install

Run the `astro add` command below with your package manager of choice and follow the prompts:

```sh
# Using PNPM
pnpm astro add astro-path-helpers
# Using NPM
npx astro add astro-path-helpers
# Using Yarn
yarn astro add astro-path-helpers
```

### Manual Install

First, install the `astro-path-helpers` package using your package manager:

```sh
# Using PNPM
pnpm add astro-path-helpers
# Using NPM
npm install astro-path-helpers
# Using Yarn
yarn add astro-path-helpers
```

Second, add the integration to your `astro.config.*` file:

**`astro.config.mjs`**

```diff
 import { defineConfig } from "astro/config";
+import pathHelpers from "astro-path-helpers";

 export default defineConfig({
   integrations: [
     // ...other integrations
+     pathHelpers()
   ],
 });
```

## Usage

After setup, you'll have auto-generated type-safe path helpers available to import throughout your application. For example, if you have these routes

```
/pages/posts.astro
/pages/posts/[slug].astro
```

Then you'll have path helpers available:

```astro
---
import { postsPath, postPath } from "astro-path-helpers/generated";
---

<a href={postsPath()}>View all posts</a>
<a href={postPath("my-first-post")}>Read my first post</a>
```


## Configuration

Astro Path Helpers has no configuration options yet. Path helpers are generated automatically based on your routes.


## Examples

### Resources

When a path segment is plural, it is considered a resource segment. Path helpers are generated for deeply nested resources.

**Route:** `/pages/products.astro`\
**Helper:** `productsPath()`

**Route:** `/pages/products/[id].astro`\
**Helper:** `productPath(productId: string)`

**Route:** `/pages/products/[id]/categories.astro`\
**Helper:** `productCategoriesPath(productId: string)`

**Route:** `/pages/products/[id]/categories/[id].astro`\
**Helper:** `productCategoryPath(productId: string, categoryId: string)`

**Route:** `/pages/products/categories.astro`\
**Helper:** `productsCategoriesPath()`

**Route:** `/pages/products/categories/[id].astro`\
**Helper:** `productsCategoryPath(categoryId: string)`

Notice the resource name is singularized in the helper name when it precedes a parameter.


### Namespaces

When a path segment is singular, it is treated as a namespace rather than a resource, and we don't ever pluralize it in helper names:

In this example, "role" is a namespace segment, and "members" is a resource segment:

**Route:** `/role/members.astro`\
**Helper:** `roleMembersPath()`

Sometimes you might have a dynamic segment after a namespace segment. Unlike resource routes, the path helper name will contain the parameter:

**Route:** `/dashboard/[id].astro`\
**Helper:** `dashboardIdPath(id: string)`

### Other Examples

#### Multi-part Segments
**Route:** `/reports/[startDate]-to-[endDate]`\
**Helper:** `reportPath(startDate: string, endDate: string)`

#### Sequential parameters
**Route:** `/docs/[lang]/[version]`\
**Helper:** `docPath(lang: string, version: string)`\
Note: Consecutive parameters must be unique. E.g. `/product/[id]/[id]` will not generate a path helper.

### Path Helper Conflicts

It is possible for two different routes to generate helpers with the same name. For example, these two routes would generate path helpers with the same name, `dashboardSectionPath`:

1. `/pages/dashboard/sections/[sectionId].astro`\
2. `/pages/dashboard/[section].astro`

Only one will be present in the generated code to avoid duplicate identifiers. It is recommended to rename one of the parameters so that you get path helpers for both routes. For example: change the second route to `/pages/dashboard/[id].astro` to change its path helper to `dashboardIdPath(id: string)`.


## Limitations

Currently, Astro Path Helpers has a few limitations:

- Only supports routes defined in the `/pages` directory
- Does not support rest parameters in routes, e.g. `[...slug]`

## Roadmap

These are possible features in future releases:

- [ ] Configuration options
- [ ] Custom path helpers via the integration config
- [ ] Override auto-generated path helper names via the integration config
- [ ] Support for [Endpoints](https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes)
- [ ] Support for rest parameters, e.g. /pages/books/[...slug]
- [x] Support for multi-part segments
- [x] Support for consecutive dynamic parts, e.g. `/pages/products/[id]/[variant]` --> `productPath(id, variant)`
- [ ] Custom rules and overrides for route name singularization and pluralization

I'd love to hear your ideas! Have a feature you'd like to see? Please reach out and share your suggestions - community feedback helps make this integration better for everyone!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to this integration.
