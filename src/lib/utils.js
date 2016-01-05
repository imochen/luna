import fs from 'fs';
import colors from 'colors';
import path from 'path';

export default {
	log : {
		normal( str ){
			console.log( str );
		},
		debug( str ){
			console.log( colors.green(str) );
		},
		info( str ){
			console.log( colors.cyan(str) );
		},
		warn( str ){
			console.log( colors.yellow(str) );
		},
		error( str ){
			console.log( colors.red(str) );
		},
		main( str ){
			console.log( colors.magenta(str) );
		}
	},
	isExists( src ){
		return fs.existsSync( src );
	},
	isDir( src ){
		let stat = fs.lstatSync( src );
		return stat.isDirectory();
	},
	isEmptyDir( src ){
		let _con = this.readDir( src );
		if( _con.length > 0 ){
			return false;
		}
		return true;
	},
	isFile( src ){
		let stat = fs.lstatSync( src );
		return stat.isFile();
	},
	readFile( src ){
		return fs.readFileSync( src ).toString();
	},
	readDir( src ){
		return fs.readdirSync( src )
	},
	mkdir( tar ){
		fs.mkdirSync( tar );
	},
	delFile( src ){
		if( this.isExists(src)  ){
			fs.unlinkSync( src );
		}
	},
	writeFile( tar , data ){
		fs.writeFileSync( tar , data );
	},
	copyFile( config ){
		let conf = config || {};

		let src = conf.source;
		let tar = conf.target;
		let overwrite = conf.overwrite;
		let replace = conf.replace;
		let updateLog = conf.updateLog;

		if( !src || !this.isFile(src) ){
			return false;
		}

		let _src_file_data = this.readFile( src );


		if( replace && replace.length > 0){
			replace.map(( item )=>{
				let _con = item.split('->');
				let _regexp = new RegExp( _con[0] ,'g');
				_src_file_data = _src_file_data.replace( _regexp , _con[1] );
			})
		}

		if( overwrite && this.isExists(tar) ){
			let _tar_file_data = this.readFile( tar );
			if( _tar_file_data !== _src_file_data ){
				this.delFile( tar );
				this.writeFile( tar , _src_file_data );
				updateLog&&updateLog();
			}
		}

		if( !this.isExists(tar) ){
			this.writeFile( tar , _src_file_data );
		}
	},
	copyDir( src , tar ){
		
		if( this.isDir( src ) ){
			if( !this.isExists(tar) ){
				this.mkdir(tar);
			}
			let _con = this.readDir( src );

			if( _con.length < 1 ){ return false;}

			_con.map((item)=>{
				if( item[0] === '.'){
					return false;
				}
				let _src_path = path.join( src , item);
				let _tar_path = path.join( tar , item);
				if( this.isDir(_src_path) ){
					this.copyDir( _src_path , _tar_path );
				}
				if( this.isFile(_src_path) ){
					this.copyFile({
						source : _src_path,
						target : _tar_path
					})
				}
			})
		}
	},
	toCamel( str ){
		var re = /-(\w)/g;
		return str.replace(re, function($0,$1){  
	        return $1.toUpperCase();  
	    });
	}
}







