import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// AT PRESENT THIS MAY NOT BE GETTING READ BUT postcss.config.mjs at PROJECT ROOT WOULD BE
console.log('ASTRO POSTCSS CONFIG BEING READ: ', __dirname)

// goddamn it https://github.com/tailwindlabs/tailwindcss/issues/6393
// (if cannot be read -- cannot read property 'config' of undefined)

// note: if you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json -- note `postcssConfig` only re webpack config)
//
// see: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.cjs'),
    },
    autoprefixer: {},
  },
}
