import { writeJsonFile, type ExecutorContext } from '@nx/devkit' // createPackageJson, createLockFile
import { readFileSync, writeFileSync } from 'fs'
import { createPackageJson, createLockFile } from '@nx/js'
import { build } from 'astro'

// import { logger } from '@nx/devkit'
// import type { ChildProcess } from 'child_process'
// import { fork } from 'child_process'
// import { removeSync } from 'fs-extra'
// import { resolve } from 'path'

import type { BuildExecutorSchema } from './schema'
import { throwIfNullish } from '@rfx/common-toolbox'

const DEFAULT_OPTIONS: Partial<BuildExecutorSchema> = {
  deleteOutputPath: true,
}

function patchNxCli(): void {
  try {
    const path = 'node_modules/nx/bin/nx.js'
    const nxCliEntryPoint = readFileSync(path, 'utf-8')
    const updatedContent = nxCliEntryPoint.replace(`require('v8-compile-cache');`, '')

    writeFileSync(path, updatedContent)
    console.log(
      'The Nx CLI was patched to allow importing ESM modules in the "@nxtensions/astro" project graph plugin.',
    )
  } catch (error: unknown) {
    console.error('The Nx CLI could not be patched.')
    throw error
  }
}

// mix of @nxtensions/astro and nx docs for generatePackageJson
export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext,
): Promise<{
  success: boolean
}> {
  console.info(`Executing "echo"...`)
  console.info(`Options: ${JSON.stringify(options, null, 2)}`)

  patchNxCli()

  const projectName = throwIfNullish(context.projectName, 'Could not find resolve project name in Nx workspace')
  const projectRoot = throwIfNullish(
    context.workspace?.projects[String(context.projectName)]?.root,
    'Could not find resolve project root directory in Nx workspace',
  )
  const projectGraph = throwIfNullish(context.projectGraph, 'Could not find resolve project graph in Nx workspace')

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  await build({
    root: projectRoot,
  })

  const packageJson = createPackageJson(projectName, projectGraph, {
    root: context.root,
    isProduction: true, // strip any non-production dependencies
  })

  // perform any additional manipulations to "package.json" here
  console.log('hello world')

  // @future if thinking of a publishable library this should be dynamic based on the package manager
  const lockFile = createLockFile(packageJson, projectGraph, 'pnpm')

  writeJsonFile(`${mergedOptions.outputPath}/package.json`, packageJson)
  writeFileSync(`${mergedOptions.outputPath}/pnpm-lock.yaml`, lockFile, {
    encoding: 'utf-8',
  })

  console.log('Executor ran for Build', mergedOptions)
  return {
    success: true,
  }
}

// function runCliBuild(workspaceRoot: string, projectRoot: string, options: BuildExecutorSchema) {
//   return new Promise((resolve, reject) => {
//     // TODO: use Astro CLI API once it's available.
//     // See https://github.com/snowpackjs/astro/issues/1483.
//     childProcess = fork(require.resolve('astro'), ['build', ...getAstroBuildArgs(projectRoot, options)], {
//       cwd: workspaceRoot,
//       stdio: 'inherit',
//     })

//     // Ensure the child process is killed when the parent exits
//     process.on('exit', () => childProcess.kill())
//     process.on('SIGTERM', () => childProcess.kill())

//     childProcess.on('error', (err) => {
//       reject(err)
//     })
//     childProcess.on('exit', (code) => {
//       if (code === 0) {
//         resolve(code)
//       } else {
//         reject(code)
//       }
//     })
//   })
// }

function getAstroBuildArgs(projectRoot: string, options: BuildExecutorSchema): string[] {
  const args: string[] = ['--root', projectRoot]

  // if (options.config) {
  //   args.push('--config', options.config)
  // }
  // if (options.drafts) {
  //   args.push('--drafts')
  // }
  // if (options.host !== undefined) {
  //   args.push('--host', options.host.toString())
  // }
  // if (options.silent) {
  //   args.push('--silent')
  // }
  // if (options.site) {
  //   args.push('site', options.site)
  // }
  if (options.verbose) {
    args.push('--verbose')
  }

  return args
}
