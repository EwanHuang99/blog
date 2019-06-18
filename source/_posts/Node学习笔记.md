---
title: Node学习笔记
date: 2018-03-01 15:02:47
tags: [node, basis, js]
categories: note
---

## 模块机制

### CommonJS

### 模块定义

### AMD

### CMD

### NPM
`NPM`是随着`NodeJS`一同安装的包管理工具，为用户提供了方便、快捷的管理和开发各种基于`Node`环境的依赖包。它的主要功能有：
1. 允许用户从NPM服务器下载别人编写的第三方包到本地使用；
2. 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用；
3. 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

#### 常用命令:
1. `NPM`版本信息
```
npm -v
```
1. 在项目中安装`NPM`依赖，并依据`package.json`安装各类依赖（生成`package-lock.json`）
```
npm install
```
3. `NPM`版本更新
```
npm install npm@latest -g
```
4. 全局安装依赖
```
npm install x -g
```
5. 在项目中安装依赖（安装在项目node_modules目录下）
```
npm install x
```
6. 在项目中安装依赖，并将依赖信息补充在`package.json`文件中的`dependencies`属性下，以便下次执行`npm install`时自动安装相关依赖
```
npm install x --save
```
7. 在项目中安装依赖，并将依赖信息补充在`package.json`文件中的`devDependencies`属性下，以便下次执行`npm install`时自动安装相关依赖。但在生产环境中安装时（`npm install x --production`）不会安装该依赖
```
npm install x --save-dev
```
8. 更新依赖模块
```
npm update x
```
9. 搜索依赖模块
```
npm search x
```
10. 自定义模块（生成`package.json`）
```
npm init
```
11. 注册`NPM`库用户
```
npm adduser
```
12. 发布自定义模块
```
npm publish
```
13. 撤销发布的模块
```
npm unpublish x@<version>
```
14. 删除已安装的模块
```
npm uninstall x
npm uninstall x --save
npm uninstall x --save-dev
```
15. 清除`NPM`缓存
```
npm cache clear
```

#### package.json与package-lock.json的区别
1. 在`package.json`中每一项依赖的版本号`^1.0.0`中的`^`指向后兼容依赖，在执行`npm install`时，会依据最大版本号`1`安装最新的依赖版本（如`1.2.0`）；
2. 在`package-lock.json`中将记录上一次执行`npm install`实际安装各个依赖的版本号，使得其他开发者知道原来使用时的依赖的实际版本号，避免向后兼容依赖导致的问题。

#### npm install与npm i的区别（Windows下）
1. 用`npm i`安装的模块无法用`npm uninstall`删除，用`npm uninstall i`才卸载掉；
2. `npm i`会帮助检测与当前`node`版本最匹配的`npm`包版本号，并匹配出来相互依赖的`npm`包应该提升的版本号；
3. 部分`npm`包在当前`node`版本下无法使用，必须使用建议版本；
4. 安装报错时`intall`肯定会出现`npm-debug.log`文件，`npm i`不一定。

## 异步I/O与非阻塞I/O

## 异步编程

## 内存控制

## Buffer

## 网络编程

## 构建Web应用

## 进程

## 测试

## 参考资料

《深入浅出Nodejs》——朴灵
[npm i和npm install的区别](https://blog.csdn.net/chern1992/article/details/79193211)
[npm install、npm install --save与npm install --save-dev区别](https://blog.csdn.net/qq_30378229/article/details/78463930)