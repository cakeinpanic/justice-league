var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	devtool: 'eval',
	entry: process.env.NODE_ENV === 'production' ? ['./src/index.js'] : [
		'webpack-dev-server/client?http://localhost:3030',
		'webpack/hot/only-dev-server',
		'./src/index.js'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	debug: true,
	externals: [
		require('webpack-require-http')
	],
	plugins: [
		new ExtractTextPlugin("bundle.css", {allChunks: true}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})

	],
	postcss: function() {
		return [autoprefixer];
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				exclude: [/src/],
				loader:  ExtractTextPlugin.extract("style-loader", "css-loader")
			},
			{
				test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
				loader: 'url-loader?limit=100000'
			},
			{
				test: /\.styl$/,
				exclude: [/node_modules/],
				loader: ExtractTextPlugin.extract(["stylus"],  "css-loader!stylus-loader!postcss-loader")
			}
		]
	}
};