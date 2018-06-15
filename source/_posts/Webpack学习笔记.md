---
title: Webpack学习笔记
date: 2018-01-29 15:02:11
tags: [advanced, js, webpack]
categories: note
---

## 简介

### 什么是Webpack
**Webpack**是一种前端**模块打包工具**：分析项目结构，找到`JavaScript`模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。

![webpack](/webpack.png)

### 与Gulp、Grunt对比
- **Grunt**和**Gulp**的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具之后可以自动替你完成这些任务。
- **Webpack**的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用`loaders`处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。

## 使用

### 安装
```
//全局安装
$ npm install -g webpack
//安装到你的项目目录
$ npm install webpack webpack-cli --save-dev
```

### 项目结构
```
node_modules
src
|-index.js
|-a.js
|-b.js
public
|-index.html
package.json
```

### 内容书写
- 在所有资源的统一入口文件`index.html`中，添加`<script>`标签，引入最后输出的脚本名，如`index.js`：
```html
<script src="/index.js"></script>
```

## 扩展

## 参考