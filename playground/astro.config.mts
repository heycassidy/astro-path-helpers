import { createResolver } from "astro-integration-kit"
import { hmrIntegration } from "astro-integration-kit/dev"
import pathHelpers from "astro-path-helpers/integration"
import { defineConfig } from "astro/config"

export default defineConfig({
  integrations: [
    pathHelpers({
      resources: [{ name: "articles", path: "posts" }],
    }),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
  ],
})
