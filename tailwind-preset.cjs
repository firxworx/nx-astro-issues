// @ts-check

const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    // custom screen breakpoints including xs + xxs
    // ~320px is ~ smallest typical smartphone width (e.g. iPhone 4 form factor)
    screens: {
      xmini: '315px',
      xxs: '400px',
      xs: '475px',
      ...defaultTheme.screens,
      '2xl': '1400px',
      '3xl': '1600px',
    },
    extend: {
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {},
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),

    // custom preset inline plugins
    function ({ addBase, addVariant, config, theme }) {
      addBase({
        ':root': {
          '--radius': '0.5rem',
          //...
        },
        '.dark': {
          // ...
        },
        html: {
          // always show vertical scrollbar to avoid jank during transitions due to scrollbar width
          // breaks radix-ui and their insistence on using an awful inconfigurable third-party scroll library
          // overflowY: 'scroll',
        },
        body: {
          // remove input type=number spinner on chrome/safari/edge/opera
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          // remove input type=number spinner on firefox
          'input[type="number"]': {
            '-moz-appearance': 'textfield',
          },
        },
        'h1,h2,h3,h4,h5,h6': {
          '@apply text-slate-700': {},
        },
        main: {
          '@apply text-slate-800': {},
          strong: {
            '@apply font-semibold': {},
          },
        },
      })
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
      addVariant('not-first-not-last', '&:not(:first-child):not(:last-child)')
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('supports-backdrop-blur', '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))')
    },
  ],
}
