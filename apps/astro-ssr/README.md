# astro-ssr

Astro UI with custom install to the Nx monorepo.

Refer to...

* `project.json` for `dev` and `build` targets.
* `astro.config.mjs` for Astro config.
* `Dockerfile` for Docker image build.

Astro 3.0 runs the dev server on port **4321** by default (vs. the previous default 3000).

Some inspiration has been taken from [@nxtensions/astro](https://www.npmjs.com/package/@nxtensions/astro) however this community plugin does not support Astro 3.0 yet.

The ideal is to fully integrate Nx + Astro in this repo and not reply on a third-party community plugin that is often not current to the latest versions of both Nx and Astro.

Refer to `.env` file in the app's directory: it is read via `dotenv` in `astro.config.mjs`.

## Development & Build

```sh
# dev server (runs on port 4321)
pnpm nx dev astro-ssr

# build
pnpm nx build astro-ssr

# astro sync + preview + check not implemented 
```

Clean build using the `astro.config.mjs` config:

```sh
pnpm nx build astro-ssr --skip-nx-cache
```

Clean build using the `astro.config.lambda.mjs` config:

```sh
pnpm nx build:lambda astro-ssr --skip-nx-cache
```
