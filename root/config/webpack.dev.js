var config = require('./webpack.base');

//开发模式。目录自动扫描。这里包含了颗粒组件
var fs = require('fs');
var path = require('path');

var projectRoot = path.dirname(__dirname);

var isDir = function( src ){
	var stat = fs.lstatSync( src );
	return stat.isDirectory();
}

var isCpmDir = function( src ){
	if( !isDir(src) ){
		return false;
	}
	return /\/\w*-\w*[\/]?$/.test( src );
}

var source = [
	path.join( projectRoot , 'src/components/' ),
	path.join( projectRoot , 'src/particles/' )
];
var alldirs = function(){
	var _dir_tmp = [];
	var _entries_tmp = {};
	source.forEach(function( src ){
		var __dirs = fs.readdirSync( src );
		__dirs.forEach(function( item ){
			var __p = path.join( src , item );
			if( isCpmDir(__p) ){
				_dir_tmp.push( __p );
				var key = src.match(/\w*\/$/)[0] + item;
				_entries_tmp[key] = path.join( src , item , 'index.js');
			}
		})
	})

	return {
		dirs : _dir_tmp,
		entries : _entries_tmp
	};
}


var dirObj = alldirs();

/*** 开发模式，组件自动加入index.html ***/
var signStart = '<!--scripts_auto_create-->';
var signEnd = '<!--scripts_end-->';
var scripts = function(){
	var str = (signStart + '\n');
	dirObj.dirs.forEach(function( item ){
		if( isCpmDir(item) ){
			str += '<script src="./build/'+ item.match(/\w*\/\w*-\w*$/)[0] +'/index.js"></script>\n';
		}
	});
	str += (signEnd+ '\n');
	return str;
}
var scriptsStr = scripts();
var devHtmlPath = path.join( projectRoot , 'index.html');
var devHtmlCon = fs.readFileSync( devHtmlPath ).toString();
var regExp = new RegExp(signStart + '[\\w\\W\\s\\n]*' + signEnd , 'gm');
var newHtmlCon = devHtmlCon.replace(regExp, scriptsStr);
fs.unlinkSync( devHtmlPath );
fs.writeFileSync( devHtmlPath , newHtmlCon );
//开发模式，组件自动加入index.html

dirObj.entries.bootstrap = path.join( path.dirname(__dirname) , 'src/bootstrap.js' );
config.entry = dirObj.entries;
/*** 将结果配置为entry ***/



config.devtool = '#source-map';
config.devServer = {
	noInfo: true,
	stats: { 
		colors: true 
	}
}
config.vue = {
	loaders: {
		js: 'babel'
	}
}
module.exports = config;