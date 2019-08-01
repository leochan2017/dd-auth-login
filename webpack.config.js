const path = require('path')
// const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  mode: 'development', // production
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dd-auth-login.min.js',
    // library: {
    //   root: 'ddAuthLogin',
    //   amd: 'dd-auth-login',
    //   commonjs: 'dd-auth-login'
    // },
    library: 'ddAuthLogin',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map', // 部分环境不支持eval-source-map，如小程序
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: true,
      parallel: true
    })
  ]
}
