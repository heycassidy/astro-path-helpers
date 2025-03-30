---
"astro-path-helpers": minor
---

generate more helpers for more paths

- stop dropping parent of nested paths
in helper name
- name helpers differently depending on whether the parent of a nested path segment is singular (namespace) or plural (resource)

BREAKING CHANGE: generated path helpers have different names for the
same routes
