module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/*.tsx'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    screen: {
      lg: { max: '1439px' },
      xl: { min: '1440px' },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
