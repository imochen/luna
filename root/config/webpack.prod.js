var webpack = require('webpack')
var config = require('./webpack.base')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
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

/*** 扫描组件目录，这里会忽略颗粒组件 ***/
var source = [
    path.join( projectRoot , 'src/components/' )
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
dirObj.entries.bootstrap = path.join( path.dirname(__dirname) , 'src/bootstrap.js' );
config.entry = dirObj.entries;
/*** 将结果配置为entry ***/

config.plugins = ( config.plugins || [] ).concat([
    new webpack.DefinePlugin({
        'process.env' : {
            NODE_ENV : '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress : {
            warnings : false
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
]);

module.exports = config;