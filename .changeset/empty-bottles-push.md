---
"astro-path-helpers": minor
---

Remove support for routes that have a dynamic part after a namespace part.
Namespace parts are currently defined as a RoutePart that is non-dynamic and singular.

This prevents an issue where it's possible for different routes to generate the same helper name.

For example, prior to this change, the following routes would generate the same helper name:

/dashboard/sections/[id] --> dashboardSectionPath
/dashboard/[section] --> dashboardSectionPath

Adding back support for these types of routes, would require either
1) coming up with a new naming convention for `/namespace/[param] routes
2) overwrite existing helpers with the name
3) adjust helper name in general if there already exists a helper with the same name
