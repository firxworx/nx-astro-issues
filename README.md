# nx-astro-issues

This repo contains an Nx workspace with `astro-ssr` app running the latest Astro 3.0 with SSR mode.

The goal is to integrate Astro with Nx and resolve certain issues.

Refer to the headings for **DevX Issues** and **Possible Bugs/Issues** below.

The final heading **References** points to some resources that may be insightful for resolving the issues.

The `package.json` dependencies and dev dependencies are reflective of a real world Nx monorepo with multiple apps (including Express, Fastify, etc) is left in place in this repo to help illustrate the issues.

Refer to the `README.md` files in the astro-ssr app and libraries such as `packages/react/core` and `packages/common/toolbox` for more details.

Note that `.env` is excluded from `.gitignore` intentionally for a quick start. Do not copy for production projects.

Astro can be run in dev via `pnpm nx dev astro-ssr` and built via `pnpm nx build astro-ssr`.

## DevX Issues

With many recent changes and deprecations in Nx a challenge is understanding how to:

1. Update the Nx dependency graph
1. Build Astro app with a `package.json` and ideally lockfile that includes _only_ the Astro dependencies + dev dependencies for an optimized Docker + CI/CD workflow
1. Build a Docker image (or a step on CI/CD) that only installs the Astro dependencies and not the kitchen sink of the monorepo
1. Enable tree-shaking of Astro dependencies and dev dependencies _including_ for _buildable_ and _publishable_ libraries

There is a stale/deprecated doc that suggested using a custom build executor to run custom build commands and using `createPackageJson` and `createLockFile` from `@nrwl/devkit`.

This seems deprecated and `createPackageJson` and `createLockFile` were apparently moved to the `@nx/js` package however I cannot find any documentation about this or how to correctly use these.

There are some older docs and years-old blog articles on how to integrate with the Nx dependency graph however these resources also seem stale/deprecated.

### 1. Dependency Graph

The Nx dependency graph is crucially important for a lot of Nx features to work properly. 

One small example is `tailwind.config.cjs` where `createGlobPatternsForDependencies()` will return an empty array because it doesn't understand what astro-ssr's dependencies are.

An undesired and inflexible workaround is to manually add glob patterns for each library that the Astro app consumes.

### 2. Packages + Lockfiles + Optimized Builds

Build the Astro project with a `package.json` and ideally lockfile that includes _only_ the Astro dependencies + dev dependencies for the purposes of building Docker images, running tests, and deployment.

This should be smart to not also include unrelated apps and libs such as for Express, Fastify, NextJs, etc.

### 3. Docker Image

Docker images should always be as small as possible and restricted to the bare minimum dependencies required to run the app.

### 4. Tree-Shaking

This is a frequent and recurring question that arises when using Nx with shared libraries for React components, helper functions, etc.

Previous solutions are being deprecated by Nx and it is unclear what the replacement and/or resolution is. For example `generatePackageJson` is being deprecated for library projects however this was part of a solution especially for tree-shaking buildable/publishable libraries.

An observation is a potential disconnect between how Nx packages vs. libraries are used by the community and different devs on the Nx team, and there may be differences in opinion over time as well per past blog posts + YouTube videos + documentation.

#### Example 

The `common-toolbox` (`packages/common/toolbox`) is buildable and publishable and demonstrates a recipe for cjs and esm compatibility and tree-shaking for ESM (applicable to React front-ends) that Nx is moving to deprecate. It would be great to understand what the replacement to achieve this same result is.

The cjs + esm dual support is necessary for shared libraries that are used by both Node apps created by Nx generators e.g. Express and React (and other) apps that use ESM e.g. Vite. Tree-shaking is essential for any front-end app and highly desired for any Node app.

## Possible Bugs/Issues

Refer to the `Dockerfile` in `apps/astro-ssr` for the Docker image build.

Inline comments show the commands used to build on x86 and ARM. For example for x86:

```bash
# for x86 workstations
DOCKER_BUILDKIT=1 docker buildx build -f apps/astro-ssr/Dockerfile -t astro-ssr-demo:latest --platform=linux/amd64 .

# run the image
docker run -it --rm -p 4321:4321 astro-ssr-demo:latest

# stop the image
docker stop $(docker ps | grep ':4321' | awk '{print $1}')
```

### 1. SegFault with Nx Build in Dockerfile

When building the Docker image using the `nx` cli via `pnpm nx` there is a segfault.

This is unexpected as the `build` target in `project.json` of `apps/astro-ssr` is only using the `nx:run-commands` executor to run the command `astro build --root apps/astro-ssr`.

There is no issue executing `pnpm build astro-ssr` when executed outside of a Docker image on the dev workstation.

There is also no issue building using the Astro CLI directly via `pnpm astro build --root apps/astro-ssr`.

### 2. "No cached ProjectGraph is available" running Astro build in Dockerfile

When running Astro CLI build in Dockerfile the warning/error is shown (although the image continues to build):

_No cached ProjectGraph is available_

## References

This third-party plugin is very insightful: https://github.com/nxtensions/nxtensions

However it is not reguarly kept in sync with either Nx or Astro versions. 

Prior to committing to Nx for production projects with Astro my goal is to achieve "command and control" over the Nx monorepo and Astro apps.

If any custom executors or plugins are necessary then they should be maintained in the monorepo and not rely on third-party community extensions.

Of interest for this repo:

Project Graph Plugin:
https://github.com/nxtensions/nxtensions/blob/main/packages/astro/src/project-graph/plugin.ts

Patching for ESM:
https://github.com/nxtensions/nxtensions/blob/main/packages/astro/src/generators/init/utilities/patch-nx-cli.ts (the plugin patches the Nx CLI for ESM by adding this to `postinstall` in `package.json`)

Patching npmrc:
https://github.com/nxtensions/nxtensions/blob/main/packages/astro/src/generators/init/utilities/setup-npmrc.ts
The plugin modifies `.npmrc` for pnpm users... It is not clear if this is necessary for Astro 3.0 with only React (so far build and dev work without this modification; it does seem like Svelte and others with Astro may require this modification based on  cursory searching).

There is a rough early addition for a custom plugin for this workspace in `workspace/nx-astro-plugin`. So far it has only been used to discover that `createPackageJson` and `createLockFile` have been moved by Nx and that the docs are no longer current.

There is an official Nx recipe example of Astro standalone (https://github.com/nrwl/nx-recipes/tree/main/astro-standalone). However it may not be very relevant as it is reduced to the simplest possible case and is not particularly reflective of a real-world monorepo with multiple apps and libraries. It does not deal with build, Docker, dependency graph, tree-shaking, etc. The library example is not buildable or publishable. It also doesn't consider SSR.
