/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const Dotenv = require('dotenv-webpack')
const TailwindCss = require('tailwindcss')
const Autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  devtool: false,
  entry: {
    options: './src/options.tsx',
    popup: './src/popup.tsx',
    background: './src/background.ts',
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
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              //sourceMap
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [TailwindCss, Autoprefixer],
              },
            },
          },
        ],
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
    new Dotenv(),
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
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
}
