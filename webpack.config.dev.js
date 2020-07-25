const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: 'development',
	devServer: {
		contentBase: 'dist',
		port: 3000
	},
	devtool: 'inline-source-map',
	plugins: [
		new CopyWebpackPlugin([{
			from: 'build/assets',
			to: 'assets'
		}]),
		new HTMLWebpackPlugin({
			template: 'build/index.html',
			filename: 'index.html'
		})
	]
}