"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var colors = _interopRequire(require("colors"));

var path = _interopRequire(require("path"));

module.exports = {
	log: {
		normal: function normal(str) {
			console.log(str);
		},
		debug: function debug(str) {
			console.log(colors.green(str));
		},
		info: function info(str) {
			console.log(colors.cyan(str));
		},
		warn: function warn(str) {
			console.log(colors.yellow(str));
		},
		error: function error(str) {
			console.log(colors.red(str));
		},
		main: function main(str) {
			console.log(colors.magenta(str));
		}
	},
	isExists: function isExists(src) {
		return fs.existsSync(src);
	},
	isDir: function isDir(src) {
		var stat = fs.lstatSync(src);
		return stat.isDirectory();
	},
	isEmptyDir: function isEmptyDir(src) {
		var _con = this.readDir(src);
		if (_con.length > 0) {
			return false;
		}
		return true;
	},
	isFile: function isFile(src) {
		var stat = fs.lstatSync(src);
		return stat.isFile();
	},
	readFile: function readFile(src) {
		return fs.readFileSync(src).toString();
	},
	readDir: function readDir(src) {
		return fs.readdirSync(src);
	},
	mkdir: function mkdir(tar) {
		fs.mkdirSync(tar);
	},
	delFile: function delFile(src) {
		if (this.isExists(src)) {
			fs.unlinkSync(src);
		}
	},
	writeFile: function writeFile(tar, data) {
		fs.writeFileSync(tar, data);
	},
	copyFile: function copyFile(config) {
		var conf = config || {};

		var src = conf.source;
		var tar = conf.target;
		var overwrite = conf.overwrite;
		var replace = conf.replace;
		var updateLog = conf.updateLog;

		if (!src || !this.isFile(src)) {
			return false;
		}

		var _src_file_data = this.readFile(src);

		if (replace && replace.length > 0) {
			replace.map(function (item) {
				var _con = item.split("->");
				var _regexp = new RegExp(_con[0], "g");
				_src_file_data = _src_file_data.replace(_regexp, _con[1]);
			});
		}

		if (overwrite && this.isExists(tar)) {
			var _tar_file_data = this.readFile(tar);
			if (_tar_file_data !== _src_file_data) {
				this.delFile(tar);
				this.writeFile(tar, _src_file_data);
				updateLog && updateLog();
			}
		}

		if (!this.isExists(tar)) {
			this.writeFile(tar, _src_file_data);
		}
	},
	copyDir: function copyDir(src, tar) {
		var _this = this;

		if (this.isDir(src)) {
			if (!this.isExists(tar)) {
				this.mkdir(tar);
			}
			var _con = this.readDir(src);

			if (_con.length < 1) {
				return false;
			}

			_con.map(function (item) {
				if (item[0] === ".") {
					return false;
				}
				var _src_path = path.join(src, item);
				var _tar_path = path.join(tar, item);
				if (_this.isDir(_src_path)) {
					_this.copyDir(_src_path, _tar_path);
				}
				if (_this.isFile(_src_path)) {
					_this.copyFile({
						source: _src_path,
						target: _tar_path
					});
				}
			});
		}
	},
	toCamel: function toCamel(str) {
		var re = /-(\w)/g;
		return str.replace(re, function ($0, $1) {
			return $1.toUpperCase();
		});
	}
};