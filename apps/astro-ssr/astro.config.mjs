// @ts-check
import * as path from 'path'
import * as url from 'url'

import dotenv from 'dotenv'
import { defineConfig } from 'astro/config'
import { workspaceRoot } from '@nx/devkit'

import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// other plugins omitted for clatify in this example...
// import mdx from '@astrojs/mdx'
// import prefetch from '@astrojs/prefetch'
// import astroI18next from 'astro-i18next'
// import sitemap from '@astrojs/sitemap'
// import partytown from '@astrojs/partytown'

// https://nx.dev/recipes/vite/set-up-vite-manually
// import tsconfigPaths from 'vite-tsconfig-paths'

// important re astro env handling:
// https://docs.astro.build/en/guides/integrations-guide/node/#runtime-environment-variables

dotenv.config()

/**
 * @typedef {import('vite').Plugin} VitePlugin
 * @typedef {import('vite').TransformOptions} TransformOptions
 */

/**
 * @typedef {Object} ViteBuildArtifactPluginOptions
 * @property {string} outDir - Astro's output directory to emit the build artifacts to.
 * @property {string} entryPoint - Entry point script path for package.json + run.sh e.g. `server/entry.mjs`
 */

// replicate the cjs __dirname and __filename for esm as a convenience in this config file
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DEFAULT_ASTRO_SITE_URL = 'https://example.com'
const DEFAULT_ASTRO_DEV_PORT = 4321

const ASTRO_SITE_URL = process.env.PUBLIC_ASTRO_SITE_URL ?? DEFAULT_ASTRO_SITE_URL
const ASTRO_DEV_PORT = process.env.ASTRO_DEV_PORT ? Number(process.env.ASTRO_DEV_PORT) : DEFAULT_ASTRO_DEV_PORT

const IS_PRODUCTION = import.meta?.['env']?.MODE === 'production' || process.env?.['NODE_ENV'] === 'production'

export const ASTRO_APP_DIR = 'apps/astro-ssr'

// path works for docker build
export const ASTRO_SRC_DIR = path.resolve(workspaceRoot, ASTRO_APP_DIR, 'src')
export const ASTRO_PUBLIC_DIR = path.resolve(ASTRO_APP_DIR, 'public')

// path corresponds to `outputs` of the `build` target in `project.json`
export const ASTRO_DIST_DIR = path.resolve(workspaceRoot, 'dist', ASTRO_APP_DIR)

/**
 * Astro config for SSR deployments.
 *
 * Build with Nx: `pnpm nx build astro-ssr`
 * Outputs to `dist/astro-ssr`
 *
 * @type {import('astro').AstroUserConfig}
 */
export const astroConfig = {
  site: IS_PRODUCTION ? ASTRO_SITE_URL : `http://localhost:${ASTRO_DEV_PORT}`,
  server: { port: ASTRO_DEV_PORT },

  outDir: ASTRO_DIST_DIR,
  srcDir: ASTRO_SRC_DIR,
  publicDir: ASTRO_PUBLIC_DIR,

  // base: '/',
  // compressHTML: IS_PRODUCTION,

  // configure dev server to only match url's with trailing slash (vs. default 'ignore') @see build.format
  trailingSlash: 'always',

  // enable SSR with 'server' or 'hybrid' (or 'static' for SSG / no SSR)
  // to opt out of server rendering in an Astro page add `export const prerender = true` to its top script block
  // to opt in to server rendering in hybrid mode use `export const prerender = false` to its top script block
  // @see https://docs.astro.build/en/guides/server-side-rendering/#server-endpoints
  output: 'hybrid', // 'server'

  // use node adapter for SSR and Docker SSR
  // @see https://docs.astro.build/en/guides/server-side-rendering/
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    // refer to docs for ssr options (note that `noExternal` is an option here)
    // @see https://docs.astro.build/en/guides/integrations-guide/node/#syntaxerror-named-export-compile-not-found
    ssr: {},

    // if specifying esbuild options is required:
    // esbuild: { exclude: ['@aws-sdk/*'] }, plugins: [] },

    // if specifying vite plugins is required:
    plugins: [
      // tsconfigPaths({ root: path.resolve(...) }),
    ],

    // if specifying vite transforms or options for rollup:
    // build: {
    //   rollupOptions: {
    //     external: [], // do not treat any modules as external
    //   },
    // },
  },

  integrations: [
    // prefetch(),
    react(),
    tailwind({
      // path helps with astro cli borking paths via the nx executor rigamarole
      configFile: path.resolve(workspaceRoot, ASTRO_APP_DIR, 'tailwind.config.cjs'),
    }),
    // if using mdx uncomment the following to use the astro mdx plugin:
    // @see https://docs.astro.build/en/guides/integrations-guide/mdx/
    // mdx({
    //   gfm: true,
    // }),
  ],
}

/**
 * @see {@link https://astro.build/config}
 */
export default defineConfig(astroConfig)
