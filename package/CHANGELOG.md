# astro-path-helpers

## 0.5.0

### Minor Changes

- [#14](https://github.com/heycassidy/astro-path-helpers/pull/14) [`e277cd1`](https://github.com/heycassidy/astro-path-helpers/commit/e277cd1915ad733a915050d4516ce54e32d9182b) Thanks [@heycassidy](https://github.com/heycassidy)! - Adds support for routes with rest parameters, e.g. `/[locale]/[...slug]`

- [#14](https://github.com/heycassidy/astro-path-helpers/pull/14) [`ffe5bfa`](https://github.com/heycassidy/astro-path-helpers/commit/ffe5bfa28ab0794c1162861e578aa39051d47bb0) Thanks [@heycassidy](https://github.com/heycassidy)! - Changes path helper names for routes with root-level dynamic segments

  E.g. the route `/[slug]` would previously have generated `rootSlugPath(slug: string)`. Now, it generates `slugPath(slug: string)`

## 0.4.0

### Minor Changes

- [#12](https://github.com/heycassidy/astro-path-helpers/pull/12) [`62849ca`](https://github.com/heycassidy/astro-path-helpers/commit/62849ca0ffb044b27de6c808fd736e1c86d62dfc) Thanks [@heycassidy](https://github.com/heycassidy)! - - Adds support for multi-part segments, e.g. `/docs/[lang]/[version]`
  - Adds support for consecutive dynamic params, e.g. `/pages/products/[id]/[variant]`. Consecutive dynamic params must be unique, `/pages/products/[id]/[id]` is not supported.

## 0.3.1

### Patch Changes

- [#10](https://github.com/heycassidy/astro-path-helpers/pull/10) [`eafd96c`](https://github.com/heycassidy/astro-path-helpers/commit/eafd96c62211f0b4119740a7d04ed5500de1ee5d) Thanks [@heycassidy](https://github.com/heycassidy)! - Fix incorrect usage instruction in README

## 0.3.0

### Minor Changes

- [#8](https://github.com/heycassidy/astro-path-helpers/pull/8) [`f56d367`](https://github.com/heycassidy/astro-path-helpers/commit/f56d3671b418e303070c8eafe8c69a8feba8a468) Thanks [@heycassidy](https://github.com/heycassidy)! - Enables support for routes with a dynamic part immediately after a namespace part

  For example, in this route, `dashboard` is a namespace part since it's singular:

  `/pages/dashboard/[id]`

  This was previously unsupported because of the potential for different routes to generate path helpers with the same name.
  For example, these two routes will generate path helpers with the same name, `dashboardSectionPath`:

  1. `/pages/dashboard/sections/[sectionId]`
  2. `/pages/dashboard/[section]`

  Only one will be present in the generated code to avoid duplicate identifiers. In case of a conflict like this, it is recommended to rename one of the parameters. For example: change the second route to `/pages/dashboard/[id]`.

  These are the resulting path helper names:

  1. `/pages/dashboard/sections/[sectionId]` --> `dashboardSectionPath`
  2. `/pages/dashboard/[id]` --> `dashboardIdPath`

  Now there is no conflict.

- [#8](https://github.com/heycassidy/astro-path-helpers/pull/8) [`9743a7d`](https://github.com/heycassidy/astro-path-helpers/commit/9743a7d43004d852575478d116884485b101405f) Thanks [@heycassidy](https://github.com/heycassidy)! - Adds global helper template context store

  This change ensures that it's impossible for multiple helpers with the same function name to appear in the generated code. If one already exists it will get overwritten.

  For example, these two paths would generate helpers with the same name, `dashboardSectionPath`:

  1. /pages/dashboard/sections/[sectionId]
  2. /pages/dashboard/[section]

  After this change, only one instance of `dashboardSectionPath` appears in the generated output. This is essential since duplicated identifiers are not allowed.

  This change also anticipates future config-based path helper generation, which will override helper auto-generated from Astro routes

- [#8](https://github.com/heycassidy/astro-path-helpers/pull/8) [`b2dc388`](https://github.com/heycassidy/astro-path-helpers/commit/b2dc388924df029f575f2ce90082f58b8ff01517) Thanks [@heycassidy](https://github.com/heycassidy)! - **Breaking** Restructure package exports so that the integration setup function is exported from the index/root of the package.

  This changes fixes an issue where package exports do not match the structure expected by `astro add astro-path-helpers`. It is not currently possible for integrations to configure `astro add` behavior, so we instead conform to `astro add` by moving the integration setup function to the index.

  Please update your imports as follows:

  astro.config.mts

  ```diff
  -import pathHelpers from "astro-path-helpers/integration"
  +import pathHelpers from "astro-path-helpers"
  ```

  All path helper imports must be updated. (Sorry, but we're still before 1.0.0!)

  MyComponent.astro

  ```diff
  -import { blogPostPath } from "astro-path-helpers"
  +import { blogPostPath } from "astro-path-helpers/generated"
  ```

### Patch Changes

- [#8](https://github.com/heycassidy/astro-path-helpers/pull/8) [`369714c`](https://github.com/heycassidy/astro-path-helpers/commit/369714cd7465bf8f8452c70587b644da3319846d) Thanks [@heycassidy](https://github.com/heycassidy)! - Fixes issue where client app wouldn't get types for path helpers

## 0.2.0

### Minor Changes

- [#6](https://github.com/heycassidy/astro-path-helpers/pull/6) [`66f4799`](https://github.com/heycassidy/astro-path-helpers/commit/66f4799de7849de09f0a838bd06ccf97f14c07e8) Thanks [@heycassidy](https://github.com/heycassidy)! - Remove support for routes that have a dynamic part after a namespace part.
  Namespace parts are currently defined as a RoutePart that is non-dynamic and singular.

  This prevents an issue where it's possible for different routes to generate the same helper name.

  For example, prior to this change, the following routes would generate the same helper name:

  /dashboard/sections/[id] --> dashboardSectionPath
  /dashboard/[section] --> dashboardSectionPath

  Adding back support for these types of routes, would require either

  1. coming up with a new naming convention for `/namespace/[param] routes
  2. overwrite existing helpers with the name
  3. adjust helper name in general if there already exists a helper with the same name

- [#6](https://github.com/heycassidy/astro-path-helpers/pull/6) [`621c8da`](https://github.com/heycassidy/astro-path-helpers/commit/621c8da80b871649251a7cdcc9209c78db6ee169) Thanks [@heycassidy](https://github.com/heycassidy)! - Add trailing slash to path returned by path helpers when Astro config option `trailingSlash` is set to `'always'`.

### Patch Changes

- [#6](https://github.com/heycassidy/astro-path-helpers/pull/6) [`61552f6`](https://github.com/heycassidy/astro-path-helpers/commit/61552f62923235dc742f044afc74c54444e331bb) Thanks [@heycassidy](https://github.com/heycassidy)! - fix: generate path helpers for root dyanmic paths, such as `/[slug]`

## 0.1.1

### Patch Changes

- [`fabe14a`](https://github.com/heycassidy/astro-path-helpers/commit/fabe14a65fc6a57a607d4234bd06094a0bf07305) Thanks [@heycassidy](https://github.com/heycassidy)! - - Add missing package.json repository field
  - Change package.json homepage link to point to package README

## 0.1.0

### Minor Changes

- [`d1e73a9`](https://github.com/heycassidy/astro-path-helpers/commit/d1e73a999b01aaa9f406b7d513da3840aba80b4c) Thanks [@heycassidy](https://github.com/heycassidy)! - generate more helpers for more paths

  - stop dropping parent of nested paths
    in helper name
  - name helpers differently depending on whether the parent of a nested path segment is singular (namespace) or plural (resource)

  BREAKING CHANGE: generated path helpers have different names for the
  same routes

## 0.0.1

### Patch Changes

- [`54317d2`](https://github.com/heycassidy/astro-path-helpers/commit/54317d2d4134284a50a34df7581ccc7818ebe16e) Thanks [@heycassidy](https://github.com/heycassidy)! - initial release

## 0.0.1-testing-20250330033008

### Patch Changes

- Update README to reflect current features

## 0.0.1-testing-20250330032620

### Patch Changes

- Rewrite integration for initial version to generate helpers based on
  Astro resolved routes instead of a config
