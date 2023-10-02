export interface BuildExecutorSchema {
  outputPath: string
  astroConfigPath: string
  deleteOutputPath?: boolean
  verbose?: boolean
}
