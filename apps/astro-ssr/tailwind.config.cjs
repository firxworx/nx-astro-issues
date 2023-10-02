// @ts-check
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind.js')
const { join } = require('path')

// const { workspaceRoot } = require('@nx/devkit')

/**
 * TailwindCSS configuration for this app.
 *
 * The glob pattern passed to `createGlobPatternsForDependencies()` is based on an example from
 * with 'cjs' and 'mjs' extensions added.
 *
 * Note the `@nxtensions/astro` version of `createGlobPatternsForDependencies()` is simply a wrapper around
 * Nx's version from `@nx/react/tailwind` except with a customized pattern. The community astro plugin version
 * can be imported from 'nxtensions/astro/tailwind'.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  presets: [require('../../tailwind-preset.cjs')],
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec|*.test).{astro,html,js,cjs,mjs,md,mdx,svelte,ts,tsx,vue}'),
    ...createGlobPatternsForDependencies(
      __dirname,
      '/**/!(*.stories|*.spec|*.test).{astro,html,js,cjs,mjs,jsx,md,mdx,svelte,ts,tsx,vue}',
    ),

    // astro doesn't know what deps are of course with astro like this so it can't create patterns
    // so in the meantime the glob patterns can be manually added as follows:
    join(
      __dirname,
      '../..',
      'packages/react/**/!(*.stories|*.spec|*.test).{astro,html,js,cjs,mjs,md,mdx,svelte,ts,tsx,vue}',
    ),
  ],
  // other common configuration options for future reference:
  // theme: { extend: {} }, plugins: [], darkMode: ['class'], safelist: [],
}

// until Nx dependency graph can be updated with Astro dependencies the following will return an empty array:
// console.log(
//   createGlobPatternsForDependencies(
//     __dirname,
//     '/**/!(*.stories|*.spec|*.test).{astro,html,js,cjs,mjs,jsx,md,mdx,svelte,ts,tsx,vue}',
//   ),
// )
