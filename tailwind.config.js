/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.ejs',
    './src/**/*.{ts,js}',
    './posts/**/*.md'
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: theme('colors.gray.700'),
            '[class~="lead"]': {
              color: theme('colors.gray.600'),
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.blue.700'),
                textDecoration: 'underline',
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            h1: {
              fontSize: '2.25rem',
              marginTop: '0',
              marginBottom: '2rem',
            },
            h2: {
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.50'),
              padding: '1rem 1.5rem',
              borderRadius: '0.375rem',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              borderRadius: '0.5rem',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            '[class~="lead"]': {
              color: theme('colors.gray.400'),
            },
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.white'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    '@tailwindcss/typography',
  ],
  darkMode: 'class',
};
