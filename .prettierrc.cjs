// prettier configuration

// plugins to consider:
// [require.resolve('prettier-plugin-tailwindcss')]

module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  bracketSpacing: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  endOfLine: 'lf',
}
