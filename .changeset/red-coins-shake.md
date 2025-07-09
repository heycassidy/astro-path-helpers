---
"astro-path-helpers": minor
---

Changes path helper names for routes with root-level dynamic segments

E.g. the route `/[slug]` would previously have generated `rootSlugPath(slug: string)`. Now, it generates `slugPath(slug: string)`
