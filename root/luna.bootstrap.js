var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var source = [
	path.join( __dirname , 'src/components/' ),
	path.join( __dirname , 'src/particles/' )
]

var oldDirs = [];
var cmd = null;
var timer = 500;

var alldirs = function(){
	var _dir_tmp = [];

	source.forEach(function( src ){
		var __dirs = fs.readdirSync( src );
		__dirs.forEach(function( item ){
			_dir_tmp.push( path.join( src , item ) );
		})
	})

	return _dir_tmp;
}

var comparedir = function( oldDirs , newDirs ){
	if( oldDirs.length !== newDirs.length ){
		return false;
	}
	var _oldDirs = oldDirs.sort().join('###');
	var _newDirs = newDirs.sort().join('###');
	if( _oldDirs !== _newDirs ){
		return false;
	}
	return true;
}

var autoReload = function(){
	var newDirs = alldirs();
	if( !comparedir( oldDirs , newDirs) ){
		if( cmd === null ){
			cmd = spawn('npm',['start']);
		}else{
			cmd.kill();
			cmd = null;
			cmd = spawn('npm',['restart']);
		}
		cmd.stdout.on('data', function (data) { 
			console.log( data.toString() ); 
		});
		cmd.stderr.on('data', function (data) { 
			console.log( data.toString() ); 
		});
		cmd.on('close',function( code ){
			console.log('child process exited with code ' + code)
		})
		oldDirs = newDirs;
	}
	setTimeout(function(){
		autoReload();
	},timer);
}

autoReload();

process.title = 'lunabootstrap';

process.on('exit',function(){
	cmd.kill();
})

