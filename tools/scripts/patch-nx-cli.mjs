/**
 * The Nx CLI uses the https://www.npmjs.com/package/v8-compile-cache package
 * to gain some performance benefits, but that package is not compatible with
 * ESM code and breaks if ESM code is imported. The Nx plugin for Astro relies
 * on the @astrojs/compiler package to populate the project graph dependencies
 * and that package is ESM. Therefore, we patch the Nx CLI and remove the usage
 * of the v8-compile-cache package.
 *
 * Note: this is only an issue when computing the project graph with the Nx Daemon
 * disabled (e.g. in CI environments).
 *
 * To deploy, add to `package.json` scripts:
 * "postinstall": "node ./tools/scripts/patch-nx-cli.js",
 *
 * Or run manually:
 * node tools/scripts/patch-nx-cli.mjs
 */
// const { readFileSync, writeFileSync } = require('fs') // will move to mjs
import { readFileSync, writeFileSync } from 'fs'

// this script is not currently active
// add it to a postinstall script in package.json to run it

try {
  const path = 'node_modules/nx/bin/nx.js'
  const nxCliEntryPoint = readFileSync(path, 'utf-8')
  const updatedContent = nxCliEntryPoint.replace(`require('v8-compile-cache');`, '')

  writeFileSync(path, updatedContent)
  console.log('The Nx CLI was patched to allow importing ESM modules in the "@nxtensions/astro" project graph plugin.')
} catch (e) {
  console.error('The Nx CLI could not be patched.')
  throw e
}
