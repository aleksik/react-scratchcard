module.exports = [
	{
		test: /\.js?$/,
		exclude: /(node_modules|bower_components|public)/,
		loader: 'babel',
		query: {
		  presets: ['es2015', 'react'],
		  plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
		}
	},
  {
		test: /\.jpg/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	}
]
