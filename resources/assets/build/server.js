'use strict'
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const WebpackDev = require('./webpack.dev')
const config = require('./config')
const chokidar = require('chokidar')
const DashboardPlugin = require('webpack-dashboard/plugin')

const compiler = webpack(WebpackDev)
const hotMiddleware = require('webpack-hot-middleware')(compiler)

// Force le rafraichissement du navigateur
const refresh = (path) => {
  console.log('* ' + path + ' changed')
  hotMiddleware.publish({action: 'reload'})
}

const server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: config.historyApiFallback,
  quiet: false,
  noInfo: false,
  publicPath: WebpackDev.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  },

  // https://webpack.js.org/configuration/dev-server/
  headers: { 'Access-Control-Allow-Origin': '*' }

})

server.use(hotMiddleware)

server.listen(config.port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  chokidar.watch(config.refresh).on('change', refresh)
  console.log('=> Listening on http://localhost:' + config.port)
})

compiler.apply(new DashboardPlugin())
