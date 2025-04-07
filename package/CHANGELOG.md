# astro-path-helpers

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
