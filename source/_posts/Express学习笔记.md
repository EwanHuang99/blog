---
title: Express学习笔记
date: 2018-05-26 14:34:33
tags: [node, server]
categories: note
---
`Express`是一个简洁而灵活的`node.js` Web应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。使用 Express 可以快速地搭建一个完整功能的网站。

## 路由

路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。它的结构如下： 
```js
app.METHOD(path, [callback...], callback)
```
`app` 是 `express` 对象的一个实例， `METHOD` 是一个 `HTTP` 请求方法， `path` 是服务器上的路径， `callback` 是当路由匹配时要执行的函数。

### 事例

```js
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});
```

> 对于所有`Method`有一个统一的方法：

```js
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});
```

### URL匹配

#### 字符串匹配
使用字符串直接匹配路径：
```js
// 匹配 /about 路径的请求
app.get('/about', function (req, res) {
  res.send('about');
});
```

#### 字符串模式匹配
融合了字符串与正则表达式的匹配模式：
```js
// 匹配 acd 和 abcd
app.get('/ab?cd', function(req, res) {
  res.send('ab?cd');
});

// 匹配 abcd、abbcd、abbbcd等
app.get('/ab+cd', function(req, res) {
  res.send('ab+cd');
});

// 匹配 abcd、abxcd、abRABDOMcd、ab123cd等
app.get('/ab*cd', function(req, res) {
  res.send('ab*cd');
});

// 匹配 /abe 和 /abcde
app.get('/ab(cd)?e', function(req, res) {
 res.send('ab(cd)?e');
});
```

#### 正则表达式匹配
```js
// 匹配 butterfly、dragonfly，不匹配 butterflyman、dragonfly man等
app.get(/.*fly$/, function(req, res) {
  res.send('/.*fly$/');
});
```

### 回调函数处理

#### 单纯的回调处理
```js
app.get('/example/b', function (req, res) {
  console.log('response will be sent by the next function ...');
}, function (req, res) {
  res.send('Hello from B!');
});
```

#### 回调执行后调用其他路由任务继续处理
```js
app.get('/example/b', function (req, res, next) {
  console.log('response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from B!');
});
```

#### 多个回调函数
```js
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]);
```

> 也可以混合使用

```js
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from D!');
});
```

## Requset

`request`对象表示HTTP请求，并具有`query string`, `parameters`, `body`, `HTTP headers`等对应的属性。

```js
app.get('/user/:id', function(request, response){
  response.send('user ' + request.params.id);
});
```

### 常用属性

1. req.app
快速返回中间件实例；
2. req.baseUrl
安装路由器实例的URL路径；
```js
var greet = express.Router();

greet.get('/jp', function (req, res) {
  console.log(req.baseUrl); // /greet
  res.send('Konichiwa!');
});

app.use('/greet', greet); // load the router on '/greet'
```
3. req.body
包含请求正文中提交的键值对数据;
4. req.cookies
使用[cookie-parser](https://www.npmjs.com/package/cookie-parser)中间件时，此属性是包含请求发送的cookie的对象。如果请求不包含cookie，则默认为{}；
5. req.fresh
表示请求是否在有效时间内：如果cache-control请求标头没有no-cache指令并且满足以下任何条件，则为true；
6. req.hostname
包含“Host”HTTP标头中的主机名；
7. req.ip
请求的远程IP地址。如果trust proxy设置为启用，则为上游地址；
8. req.params
包含映射到命名路由“parameters”的属性的对象。例如，如果您有路线/user/:name，则“name”属性可用作req.params.name。该对象默认为{}；
9. req.path
包含请求URL的路径部分；
10. req.protocol
请求协议；
11. req.query
包含路由中每个查询字符串参数的属性的对象。如果没有查询字符串，则它是空对象{}：
```js
// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
req.query.order
// => "desc"

req.query.shoe.color
// => "blue"

req.query.shoe.type
// => "converse"
```
12. req.route
当前匹配的路由的信息（`JSON`）；
13. req.xhr
一个布尔值，true如果请求的“X-Requested-With”头字段是“XMLHttpRequest”，则表示该请求是由客户端库（如jQuery）发出的。

## Response

**response**对象表示Express应用程序在收到HTTP请求时发送的**HTTP响应**。

```js
app.get('/user/:id', function(request, response){
  response.send('user ' + request.params.id);
});
```

### 常用属性
1. res.app
此属性包含对使用中间件的快速应用程序实例的引用；
2. res.headersSent
布尔属性，是否为响应添加HTTP头；
3. res.locals
包含作用于请求的响应局部变量的对象，因此仅对在请求/响应周期（如果有）期间呈现的视图可用；

### 常用方法
1. res.append(field [，value])
位HTTP请求头添加字段：
```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
res.append('Warning', '199 Miscellaneous warning');
```

> 注：在`res.append()`后调用`res.set()`将重置之前设定额字段值。

2. res.cookie(name, value [, options])
为`cookie`设置`name`为`value`。所述value参数可以是转换为JSON字符串或对象。`options`参数是一个可以具有以下属性的对象：

Option|Type|含义
:-:|:-:|:-:
domain|string|Cookie的域名。默认为应用程序的域名。
expires|date|GMT中cookie的到期日。如果未指定或设置为0，则创建会话cookie。
httpOnly|boolean|标记cookie只能由Web服务器访问。
maxAge|string|方便的选项，用于设置相对于当前时间的到期时间（以毫秒为单位）。
path|string|Cookie的路径。默认为“/”。
secure|string|将cookie标记为仅与HTTPS一起使用。
signed|boolean|指示cookie是否应该签名。

3. res.clearCookie(name [, option])
清除`cookie`中指定得键值对及对应的`option`；

4. res.download(path [, filename] [, fn])
向浏览器传输文件（path指定），并在浏览器端提示用户下载。当错误发生或传输完成时，该方法调用可选的回调函数fn；

5. res.end()
快速结束响应；

6. res.format(Object)
依据HTTP请求头中不同的`Accept`的`MIME`类型匹配不同的响应规则。若没有匹配则返回`406“Not Acceptable”`响应或者调用`default`指定的回调函数：
```js
res.format({
  'text/plain': function(){
    res.send('hey');
  },

  'text/html': function(){
    res.send('<p>hey</p>');
  },

  'application/json': function(){
    res.send({ message: 'hey' });
  },

  'default': function() {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable');
  }
});
```

> 除了规范化的MIME类型之外，您还可以使用映射到这些类型的扩展名来实现稍微冗长的实现：

```js
res.format({
  text: function(){
    res.send('hey');
  },

  html: function(){
    res.send('<p>hey</p>');
  },

  json: function(){
    res.send({ message: 'hey' });
  }
});
```

7. res.get(field)
获取响应头部对应的字段值；
8. res.json([body])
返回一个`JSON`对象；
9. res.jsonp([body])
在`jsonp`的技术支持上返回`JSON`对象，作为回调函数的参数值；
10. res.location(path)
将HTTP响应头中的`Location`字段值设定成`path`；
11. res.redirect([status,] path)
使页面重定向致`path`指定的路径，`status`默认值为`302`（Found）;
12. res.render(view [, locals] [, callback])
渲染模板`view`成html并返回给客户端呈现，`locals`表示视图中的局部变量，回调函数用于处理异常；
13. res.send([body])
发送HTTP响应，响应的内容可为`Buffer`、`String`、`Array`；
14. res.sendFile(path [, options] [, fn])
传输指定的`path`文件，并依据文件格式自动修改`Content-Type`字段。
15. res.sendStatus(statusCode)
响应状态码；
16. res.set(field [, value])
将响应的HTTP标头设置field为value。要一次设置多个字段，请传递一个对象作为参数。等于`res.header()`：
```js
res.set('Content-Type', 'text/plain');

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  'ETag': '12345'
})
```
17. res.status(statusCode)
设置响应状态码；
18. res.type(type)
设置响应头部中`Content-type`类型，将自动映射对应格式到`MIME`类型；

## 静态资源处理

`express.static(root, [options])`是 Express 内置的唯一一个中间件。是基于 `serve-static` 开发的，负责托管 Express 应用内的静态资源。`root`参数指的是静态资源文件所在的根目录。`options`对象是可选的，支持以下属性：

Option|描述|类型|默认值
:-:|:-:|:-:|:-:
dotfiles|服务dotfiles的选项。可能的值是“允许”，“拒绝”和“忽略”|String|“ignore”
etag|启用或禁用etag生成|Boolean|true
extensions|设置文件扩展名后备。|Boolean|false
index|发送目录索引文件。设置false为禁用目录索引。|Mixed|“index.html”
lastModified|将Last-Modified标头设置为OS上文件的上次修改日期。可能的值是true或false。|Boolean|true
maxAge|设置Cache-Control标头的max-age属性（以毫秒为单位）或字符串（以ms格式）|Number|0
redirect|当路径名是目录时，重定向到尾随“/”。|Boolean|true
setHeaders|用于设置HTTP标头以与文件一起提供的功能。|Function| 	 |

## 路由对象与中间件

### Router对象
**Router**对象是Express 4.0版本新增的扩展原由路由功能的对象。`Router`对象不同于直接通过`Express`对象设定路由及处理方式，`Express`对象的路由设定与当前应用之间有着强耦合的关系，一旦设定即设定了相对根路径的处理。而`Router`对象实现了应用与路由之间的隔离。它既能向`Express`中的方法一样指定整个应用的路由，也能作为参数传递给`app.use(path, router)`作为**中间件**（新的应用模块）的子路由：
```js
// ---- 建立应用 ----
var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;

// ---- ROUTES ----

// Express3.0的路由设定方法（http://localhost:8080/sample）
app.get('/sample', function(req, res) {
  res.send('this is a sample!');
});

// Express4.0 Router

// 获取Router对象
var router = express.Router();

// 首页路由(http://localhost:8080)
router.get('/', function(req, res) {
  res.send('home page!');
});

// 网页路由 (http://localhost:8080/about)
router.get('/about', function(req, res) {
  res.send('about page!');
});

// 将路由应用到程序
app.use('/', router);

// ---- 启动服务器 ----
app.listen(port);
```
上述中首先通过`Router`对象定义了各种请求的处理，不同于通过`Express`直接定义的路由，此时该路对象由并没有生效。而是通过`app.use`将路由绑定至根路径下才与应用结合、生效。如果将`app.use('/', router)`改为`app.use('/test', router)`，上述路由则在应用中则变成：`localhost:8080/test/`与`localhost:8080/test/about`两个路径。

### 中间件（Middleware）
中间件类似一个请求拦截机制，在服务器实际处理请求之前，请求将被中间件拦截下来，中间件先对请求进行操作（如解析、认证等）再交由服务器处理。
```js
var router = express.Router();

// 引入以下回调函数作为中间件，每个router处理的请求都将先由它处理
router.use(function(req, res, next) {

  console.log(req.method, req.url);

  // 继续处理请求
  next();
});

router.get('/', function(req, res) {
  res.send('home page!');
});

router.get('/about', function(req, res) {
  res.send('about page!');
});

app.use('/', router);
```

> 注：中间件只在对其被引入后定义的`routes`有效，如果在引入中间件之前定义`routes`将不会被中间件处理。

## 参考
[《Express.js 4.0 的路由（Router）功能用法教學》](https://blog.gtwang.org/programming/learn-to-use-the-new-router-in-expressjs-4/)
