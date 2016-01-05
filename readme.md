## luna

> Vuejs的组件化开发工具

### luna是个啥？
别着急，慢慢看。luna不止是vue-loader的封装，同时也干了很多别的事。下面是使用luna开发的组件的目录。
```bash
├── bootstrap #启动器相关
│   ├── basic.js #包含vuejs及组件标识
│   └── index.js #启动器
└── components #组件文件夹
    ├── test-title
    │   ├── index.css
    │   └── index.js
    └── test-banner
        ├── index.css
        └── index.js
```
一共包含两类文件，一类启动器相关，一类是组件。那我们怎么使用嘞？接着看
```html
<!-- html 中组件这么使用 -->
<test-title></test-title>
<test-banner></test-banner>

<!-- 基础文件 -->
<script src="/path/to/bootstrap/basic.js"></script>

<!-- test-title 组件 -->
<script src="/path/to/components/test-title/index.js"></script>
<link rel="stylesheet" href="/path/to/components/test-title/index.css">

<!-- test-banner 组件 -->
<script src="/path/to/components/test-banner/index.js"></script>
<link rel="stylesheet" href="/path/to/components/test-banner/index.css">

<!-- 启动器 -->
<script src="/path/to/bootstrap/index.js"></script>
<script>
	luna.start(); //手动发射
</script>
```
按照国际惯例，基础文件先加载。启动器最后加载，为了使用便捷，可以手动发射。
中间呢加载的是组件。如果你开发了N多组件，这里可以只写你需要的即可。
推荐使用合并加载，或者使用其他工具打包需要的组件。这样可以减少请求数。

### 怎么使用？
好像有那么点意思，那luna怎么使用呢？由于`luna`模块已经被注册了，坑爹的`luna-cli`也被注册了。最后，我们只能退而求其次`luna-command`了。记得要全局安装哦
```bash
npm install -g luna-command
```
安装完之后，会多一个`luna`命令，虽然模块被注册了，还好。命令名字我们可以自己定义。
```bash
luna init testProject #初始化一个项目

luna update #更新项目资源。需在项目根目录执行。

luna component test-component #新建一个组件，需在项目根目录执行。

luna particle test-particle #新建一个颗粒组件，需在项目根目录执行。

luna -h #查看所有帮助
luna -v #查看版本号
```
默认新建`component`的时候使用的是常规模式，新建`particle`使用的是mini模式。常规模式css/js/html是分开的，mini模式是把他们一起放到.vue里面了。你也可以通过命令后面加参数`-m/-n`来强制使用哪种模式。

### 如何进行开发？

介绍完命令，我们新建一个项目，进入根目录，安装依赖`npm install`。执行`npm run dev`即可开始开发。默认会打开本地`8016`端口来调试组件。

开发过程中，使用`luna component/luna particle`新建组件或者颗粒，是不用重启命令的。

开发完成后，执行`npm run build`即可将组件打包。