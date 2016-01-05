var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = {
	output: {
		path: './build',
		publicPath: 'build/',
		filename: '[name]/index.js'
	},
	module: {
		loaders: [
			{ test: /\.vue$/, loader : 'vue'},
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
		]
	},
	plugins : [
	    new webpack.optimize.CommonsChunkPlugin('bootstrap/basic.js'),
	    new ExtractTextPlugin('[name]/index.css')
	],
	babel : {
		"presets": ["es2015", "stage-0"],
		"plugins": ["transform-runtime"]
	},
	vue : { 
		loaders : {
	        js: 'babel',
	        css: ExtractTextPlugin.extract("css"),
	        sass: ExtractTextPlugin.extract("css!sass")
	    },
	    autoprefixer: {
			browsers: ['last 5 versions']
		}
	}
}