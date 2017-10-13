'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./config')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// const postcss = {
//   plugins: [
//     require('autoprefixer')({
//       browsers: config.browsers
//     })
//   ]
// }

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'dev'
})

const extractCss = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'dev'
})

const webpackBase = {
  entry: config.entry,
  output: {
    path: config.assets_path,
    filename: '[name].js',
    publicPath: config.assets_url
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      root: path.join(__dirname, '../js'),
      components: path.join(__dirname, '../js/components'),
      utils: path.join(__dirname, '../js/utils'),
      vue: 'vue/dist/vue.js',
      main: path.join(__dirname, '../js/main')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   exclude: [/node_modules/, /libs/, /build/],
      //   enforce: 'pre',
      //   options: {
      //     formatter: require("eslint-friendly-formatter")
      //   }
      // },
      {
        test: /\.js$/,
        exclude: [/node_modules/, /libs/],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: [/node_modules/],
        loader: 'vue-loader',
        options: {
          // https://vue-loader.vuejs.org/en/configurations/pre-processors.html
          loaders: {
            // Contrary to what its name indicates, sass-loader parses SCSS syntax by default.
            // scss: 'vue-style-loader!css-loader!sass-loader',
            scss: extractSass.extract({
              fallback: 'style-loader',
              use: [{
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              }, {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }]
            }),
            js: 'babel-loader'
            // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
          }
        }
      },

      /**
       * Use the css-loader or the raw-loader to turn it into a JS module and the ExtractTextPlugin to extract it into a separate file.
       */
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              // translates CSS into CommonJS
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, /* {
              loader: 'postcss-loader'
            }, */
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: { // You can also pass options directly to node-sass
                includePaths: [ path.join(__dirname, '../sass/') ],
                outputStyle: 'compressed',
                sourceMap: true
              }
            }
          ],
          // use style-loader in development
          fallback: 'style-loader' // creates style nodes from JS strings
        })
      },

      {
        test: /\.css$/,
        // loader: ['css-loader', 'postcss-loader']
        use: extractCss.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }, {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 10,
            name: '[name].[ext]'
          }
        }]

      }
    ]
  },
  plugins: [
    extractSass,
    new FriendlyErrorsWebpackPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: config.vendor,
      // (the commons chunk name)

      filename: process.env.NODE_ENV === 'dev' ? 'commons.js' : 'commons.[chunkhash:8].js',
      // (the filename of the commons chunk)

      // https://webpack.js.org/plugins/commons-chunk-plugin/#passing-the-minchunks-property-a-function
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false
        }
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),

    /**
     * A lesser-known feature of the CommonsChunkPlugin is extracting webpack's boilerplate
     * and manifest which can change with every build.
     * By specifying a name not mentioned in the entry configuration,
     * the plugin will automatically extract what we want into a separate bundle
     * Source: https://webpack.js.org/guides/caching/#extracting-boilerplate
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ]
}

if (config.stylelint) {
  webpackBase.plugins.push(
    new StyleLintPlugin({
      files: config.stylelint
    })
  )
}

if (config.html) {
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  webpackBase.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  )
}

module.exports = webpackBase
