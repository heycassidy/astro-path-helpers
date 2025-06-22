---
"astro-path-helpers": minor
---

- Adds support for multi-part segments, e.g. `/docs/[lang]/[version]`
- Adds support for sequential dynamic params, e.g. `/pages/products/[id]/[variant]`. Sequential dynamic params must be unique, `/pages/products/[id]/[id]` is not supported.
