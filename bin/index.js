"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var program = _interopRequire(require("commander"));

var colors = _interopRequire(require("colors"));

var utils = _interopRequire(require("./lib/utils"));

var lunaRoot = path.dirname(__dirname);
var runRoot = process.cwd();

var lunaPath = function (dir) {
	return path.join(lunaRoot, dir);
};

var runPath = function (dir) {
	return path.join(runRoot, dir);
};

var updates = ["package.json", "src/bootstrap.js", "src/px2rem.scss", "static/js/hotcss.js", "static/js/zepto.js", "config/webpack.base.js", "config/webpack.dev.js", "config/webpack.prod.js", "luna.bootstrap.js"];

var getVersion = function () {
	var _filePath = lunaPath("package.json");
	return JSON.parse(utils.readFile(_filePath)).version;
};

var checkEnv = function () {
	var isluna = true;
	["package.json", "src/bootstrap.js", "config/webpack.base.js", "config/webpack.dev.js", "config/webpack.prod.js", "luna.bootstrap.js"].map(function (item) {
		var _tar = runPath(item);
		if (!utils.isExists(_tar) && isluna) {
			isluna = false;
		}
	});
	return isluna;
};

var _createProject = function (projectRootPath) {

	var tarPath = function (dir) {
		return path.join(runRoot, projectRootPath, dir);
	};

	utils.copyFile({
		source: lunaPath("root/package.json"),
		target: tarPath("package.json")
	});

	utils.copyFile({
		source: lunaPath("root/index.html"),
		target: tarPath("index.html")
	});

	utils.copyFile({
		source: lunaPath("root/luna.bootstrap.js"),
		target: tarPath("luna.bootstrap.js")
	});

	utils.copyDir(lunaPath("root/config/"), tarPath("config/"));
	utils.copyDir(lunaPath("root/src/"), tarPath("src/"));
	utils.copyDir(lunaPath("root/static/"), tarPath("static/"));
};

var createProject = function (projectRootPath) {
	if (utils.isExists(projectRootPath)) {
		if (!utils.isEmptyDir(projectRootPath)) {
			utils.log.warn("`" + projectRootPath + "` is not an empty directory.");
			return false;
		}
	} else {
		utils.mkdir(projectRootPath);
	}

	_createProject(projectRootPath);

	utils.log.normal("\n  enter path:");
	utils.log.main("  $ cd " + projectRootPath + "\n");

	utils.log.normal("  install dependencies:");
	utils.log.main("  $ npm install\n");

	utils.log.normal("  run the app:");
	utils.log.main("  $ npm run dev\n");
};

var updateProject = function () {
	if (!checkEnv()) {
		utils.log.warn("`" + runRoot + "` is not a luna project!");
		return false;
	}
	var updateNum = 0;
	updates.map(function (item) {
		var _src_path = lunaPath(path.join("root", item));
		var _tar_path = runPath(item);
		utils.copyFile({
			source: _src_path,
			target: _tar_path,
			overwrite: true,
			updateLog: function updateLog() {
				updateNum++;
				utils.log.debug(" file `" + item + "` is already update!");
			}
		});
	});
	if (updateNum === 0) {
		utils.log.warn(" no file need to update!");
	}
};

var createWidthSnippet = function (type, name) {
	if (name.indexOf("-") < 0) {
		utils.log.error("`" + name + "` is not available . Example: title-normal ");
		return false;
	}
	if (!checkEnv()) {
		utils.log.warn("`" + runRoot + "` is not a luna project!");
		return false;
	}
	var _src_path = lunaPath("root/template/component/");
	var _tar_path = runPath("src/" + type + "/" + name);
	var nameCamel = utils.toCamel(name);

	if (utils.isExists(runPath("src/components/" + name))) {
		utils.log.error("components `" + name + "` is already exist!");
		return false;
	}
	if (utils.isExists(runPath("src/particles/" + name))) {
		utils.log.error("particles `" + name + "` is already exist!");
		return false;
	}

	utils.mkdir(_tar_path);
	utils.mkdir(path.join(_tar_path, "snippet"));

	utils.copyFile({
		source: path.join(_src_path, "index.js"),
		target: path.join(_tar_path, "index.js"),
		replace: ["{{name}}->" + name, "{{nameCamel}}->" + nameCamel]
	});

	utils.copyFile({
		source: path.join(_src_path, "tpl.vue"),
		target: path.join(_tar_path, name + ".vue")
	});

	utils.copyFile({
		source: path.join(_src_path, "snippet/tpl.html"),
		target: path.join(_tar_path, "snippet/tpl.html"),
		replace: ["{{name}}->" + name, "{{nameCamel}}->" + nameCamel]
	});

	utils.copyFile({
		source: path.join(_src_path, "snippet/style.css"),
		target: path.join(_tar_path, "snippet/style.css"),
		replace: ["{{name}}->" + name, "{{nameCamel}}->" + nameCamel]
	});

	utils.copyFile({
		source: path.join(_src_path, "snippet/script.js"),
		target: path.join(_tar_path, "snippet/script.js")
	});

	utils.log.debug(type + " `" + name + "` has been created!");
};

var createSimple = function (type, name) {
	if (name.indexOf("-") < 0) {
		utils.log.error("`" + name + "` is not available . Example: title-normal ");
		return false;
	}
	if (!checkEnv()) {
		utils.log.warn("`" + runRoot + "` is not a luna project!");
		return false;
	}
	var _src_path = lunaPath("root/template/particle/");
	var _tar_path = runPath("src/" + type + "/" + name);
	var nameCamel = utils.toCamel(name);

	if (utils.isExists(runPath("src/components/" + name))) {
		utils.log.error("components `" + name + "` is already exist!");
		return false;
	}
	if (utils.isExists(runPath("src/particles/" + name))) {
		utils.log.error("particles `" + name + "` is already exist!");
		return false;
	}

	utils.mkdir(_tar_path);

	utils.copyFile({
		source: path.join(_src_path, "index.js"),
		target: path.join(_tar_path, "index.js"),
		replace: ["{{name}}->" + name, "{{nameCamel}}->" + nameCamel]
	});

	utils.copyFile({
		source: path.join(_src_path, "tpl.vue"),
		target: path.join(_tar_path, name + ".vue"),
		replace: ["{{name}}->" + name, "{{nameCamel}}->" + nameCamel]
	});

	utils.log.debug(type + " `" + name + "` has been created!");
};

var createTpl = function (name, type) {

	if (program.mini || program.normal) {
		if (program.mini) {
			createSimple(type, name);
		}
		if (program.normal) {
			createWidthSnippet(type, name);
		}
	} else {
		if (type === "components") {
			createWidthSnippet(type, name);
		}
		if (type === "particles") {
			createSimple(type, name);
		}
	}
};

var displayVersion = function () {
	var version = getVersion();
	var chars = ["####################################", "#      __                          #", "#     / / __  __  ____     __ _    #", "#    / / / / / / /  __ \\  /  __`/  #", "#   / / / /_/ / / /  / / / /_/ /   #", "#  /_/  \\__,_/ /_/  /_/  \\__,_/\\   #", "#                                  #", "#            v " + version + "               #", "####################################"].join("\n");
	utils.log.main("\n" + chars + "\n");
};

program.usage("[command] <options ...>");
program.option("-v, --version", "output the version number", function () {
	displayVersion();
});

program.option("-m, --mini", "when create component/particle use mini template");
program.option("-n, --normal", "when create component/particle use normal template");

program.command("init <projectPath>").description("init a new project").action(function (projectPath) {
	createProject(path.normalize(projectPath + "/"));
});

program.command("update").description("update your project , please use at the root of your project").action(function () {
	updateProject();
});

program.command("component <componentName>").description("create a new component").action(function (componentName) {
	createTpl(componentName, "components");
});

program.command("particle <particleName>").description("create a new particle").action(function (particleName) {
	createTpl(particleName, "particles");
});

program.on("--help", function () {
	utils.log.normal("  Examples:\n");
	utils.log.normal("     luna component title-normal\n");
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
	program.outputHelp();
}