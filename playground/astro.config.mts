import { createResolver } from "astro-integration-kit"
import { hmrIntegration } from "astro-integration-kit/dev"
import { defineConfig } from "astro/config"

import pathHelpers from "astro-path-helpers"

export default defineConfig({
  integrations: [
    pathHelpers(),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
  ],
})
