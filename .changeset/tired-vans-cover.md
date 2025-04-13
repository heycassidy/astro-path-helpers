---
"astro-path-helpers": minor
---

**Breaking** Restructure package exports so that the integration setup function is exported from the index/root of the package.

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
