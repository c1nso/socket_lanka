const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const uglify = require("uglifyjs-webpack-plugin");

const PATHS = {
	src: path.join(__dirname, "./src"),
	build: path.join(__dirname, './dist')
};

module.exports = {
	mode: "development",
	entry: {
		'webSocket': PATHS.src + '/index.ts'
	},
	output: {
		path: PATHS.build,
		filename: '[name].js',
		library: 'WebSocket',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new uglify(),
		new WebpackBuildNotifierPlugin({
			title: 'My Project Webpack Build'
		}),
		new webpack.IgnorePlugin(/test\.ts$/)
	]
};
