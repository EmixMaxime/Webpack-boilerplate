'use strict'
const path = require('path')
const webpack = require('webpack')
const Merge = require('webpack-merge')
const BaseConfig = require('./webpack.base')
const config = require('./config')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// Je ne sais pas trop pourquoi, mais voilà :-)
for (let name in BaseConfig.entry) {
  BaseConfig.entry[name] = [path.resolve(__dirname, './server-client'), ...BaseConfig.entry[name]]
}

const DevConfig = {
  devtool: 'cheap-module-eval-source-map', // https://webpack.js.org/guides/development/#source-maps
  output: { publicPath: 'http://localhost:' + config.port + config.assets_url, path: '/tmp/' },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

if (config.bundleAnalyzerPort) {
  DevConfig.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: config.bundleAnalyzerPort }))
}

module.exports = Merge(BaseConfig, DevConfig)
