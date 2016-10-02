'use strict'

var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	exclude: /(node_modules|public)/,
	loaders: [
		'style?sourceMap',
		'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
	]
});

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
		`./example/src/index.js`
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
  output: {
		path: path.join(__dirname, 'example/dist'),
		filename: 'bundle.js'
	},
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders
  },
  devServer: {
    contentBase: './example/dist',
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: HOST
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './example/src/index.html',
      title: 'react-scratchcard example'
    })
  ]
}
