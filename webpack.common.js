/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    options: './src/options.tsx',
    popup: './src/popup.tsx',
  },
  output: {
    path: __dirname + '/dist',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false, // LICENCE.txtを生成しない
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './manifest.json',
          to: 'manifest.json',
        },
        {
          from: './static/popup.html',
          to: 'popup.html',
        },
        {
          from: './static/options.html',
          to: 'options.html',
        },
        {
          from: './assets',
          to: 'assets',
        },
      ],
    }),
  ],
}
