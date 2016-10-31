export default {
	output: {
		filename: 'hldemo.js',
		library: 'HLDemo',
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [/node_modules/],
			},
		],
	},
	resolve: {
		extensions: ['', '.js'],
	},
};
