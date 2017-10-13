'use strict'
const webpack = require('webpack')
const Merge = require('webpack-merge')

const BaseConfig = require('./webpack.base')
const config = require('./config')

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

// Merge : https://webpack.js.org/guides/production/#advanced-approach
module.exports = Merge(BaseConfig, {
  devtool: false,
  output: { filename: '[name].[chunkhash:8].js' },

  plugins: [
    new ProgressBarPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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

    new BabiliPlugin(),

    new AssetsPlugin({
      path: config.assets_path,
      filename: 'assets.json'
    })

  ]
})