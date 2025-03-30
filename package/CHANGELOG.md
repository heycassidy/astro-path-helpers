# astro-path-helpers

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
