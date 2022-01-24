module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/*.tsx', './src/*/*.tsx'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        mainColor: '#D89145',
        subColor: '#EBCBA5',
        captionColor: '#C4C4C4',
        dividerColor: '#E5E5E5',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
