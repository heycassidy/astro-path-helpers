---
"astro-path-helpers": minor
---

Adds global helper template context store

This change ensures that it's impossible for multiple helpers with the same function name to appear in the generated code. If one already exists it will get overwritten.

For example, these two paths would generate helpers with the same name, `dashboardSectionPath`:

1. /pages/dashboard/sections/[sectionId]
2. /pages/dashboard/[section]

After this change, only one instance of `dashboardSectionPath` appears in the generated output. This is essential since duplicated identifiers are not allowed.

This change also anticipates future config-based path helper generation, which will override helper auto-generated from Astro routes
