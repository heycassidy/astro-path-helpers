# `astro-path-helpers`

> **⚠️ WORK IN PROGRESS**: This integration is still under active development and not yet ready for production use.

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that generates type-safe path helper functions for your Astro routes, making it easy to manage and reference nested routes in your application.


## Usage

`astro-path-helpers` simplifies route management by generating consistent path helper functions based on your configured resources. After setup, you'll have reliable, type-safe links throughout your application. For example, with routes like:

```
src/pages/posts/index.astro
src/pages/posts/[slug].astro
```

You can use these path helpers:

```astro
---
import { postsPath, postPath } from "astro-path-helpers";
---

<a href={postsPath()}>View all posts</a>
<a href={postPath("my-first-post")}>Read my first post</a>
```

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-path-helpers
```

```bash
npx astro add astro-path-helpers
```

```bash
yarn astro add astro-path-helpers
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-path-helpers
```

```bash
npm install astro-path-helpers
```

```bash
yarn add astro-path-helpers
```

2. Add the integration to your astro config

```diff
+import pathHelpers from "astro-path-helpers/integration";

export default defineConfig({
  integrations: [
+    pathHelpers(),
  ],
});
```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/cassidysmith/astro-path-helpers/blob/main/LICENSE). Made with ❤️ by [Cassidy Smith](https://github.com/cassidysmith).

## Acknowledgements

- Created using [astro-integration-template](https://github.com/florian-lefebvre/astro-integration-template).
- Uses [inflection](https://www.npmjs.com/package/inflection) for handling singular/plural forms.
