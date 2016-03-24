var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
	devtool: 'eval',
	entry: [
		'webpack-dev-server/client?http://localhost:3030',
		'webpack/hot/only-dev-server',
		'./src/index.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	externals:[
		require('webpack-require-http')
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})

	],
	postcss: function () {
		return [autoprefixer];
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				exclude: [ /src/],
				loader: 'style!css'
			},
			{
				test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
				loader: 'url-loader?limit=100000'
			},
			{
				test: /\.css$/,
				exclude: [ /node_modules/],
				loader: 'style!css!postcss'
			}
		]
	}
};