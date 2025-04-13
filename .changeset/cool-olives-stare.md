---
"astro-path-helpers": minor
---

Enables support for routes with a dynamic part immediately after a namespace part

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
