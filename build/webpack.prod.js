'use strict'
const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const Merge = require('webpack-merge')
// const ExtractCSSPlugin = require('./extractCSSPlugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const BaseConfig = require('./webpack.base')
const config = require('./config')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// Un peu de doc sur Merge : https://webpack.js.org/guides/production/#advanced-approach
module.exports = Merge(BaseConfig, {
  devtool: false,
  output: { filename: '[name].[chunkhash:8].js' },

  plugins: [
    new ProgressBarPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false
    }),

    // vendor hash stay consistent between builds
    new webpack.HashedModuleIdsPlugin(),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    // UglifyJS ne marche pas si je n'ai pas le preset es2015... À faire attention dans mon babelrc
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true
    //   },
    //   compress: {
    //     screw_ie8: true,
    //     warnings: false // sans ça j'ai 1 milliard de warnings...
    //   },
    //   comments: false
    // }),

    new BabiliPlugin(),

    new AssetsPlugin({
      path: config.assets_path,
      filename: 'assets.json'
    })

  ]
})

// webpack_base.devtool = false
// webpack_base.output.filename = '[name].[chunkhash:8].js'
/*
webpack_base.plugins.push(
  new ProgressBarPlugin(),
  // new ExtractCSSPlugin('[name].[contenthash:8].css'),

  // https://webpack.js.org/guides/production/#node-environment-variable
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),

  // new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: false
  //   },
  //   comments: false
  // }),

  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),

  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true,
      keep_fnames: true
    },
    compress: {
      screw_ie8: true
    },
    comments: false
  }),

  new AssetsPlugin({
    path: config.assets_path,
    filename: 'assets.json'
  })
) */

// module.exports = webpack_base
