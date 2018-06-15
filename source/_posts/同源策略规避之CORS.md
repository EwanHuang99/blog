---
title: 同源策略规避之CORS
date: 2018-02-13 22:33:12
tags: [browser, basis, js]
categories: note
---

**CORS**是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。它允许浏览器向跨源服务器，发出`XMLHttpRequest`请求，从而克服了AJAX只能同源使用的限制。

## 特点

### 兼容情况

CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

### 服务器实现

实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。浏览器发送AJAX请求时会自动判断是否为跨域请求，不需要客户端做出额外的编码。

## 简单请求

### 定义

只要同时满足以下两大条件，就属于简单请求:
1. 请求方法是以下三种方法之一：
    - HEAD
    - GET
    - POST
2. HTTP的头信息不超出以下几种字段：
    - Accept
    - Accept-Language
    - Content-Language
    - Last-Event-ID
    - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

### 跨域实现

对于AJAX简单请求，浏览器就自动在头信息之中，添加一个Origin字段指明请求源（类似WebSocket的跨域原理）。服务器判断Orign是否在其许可范围内，如果在其许可范围内，则返回一个含有`Access-Control-Allow-Origin`响应头字段的HTTP响应。如果不在范围内，则返回一个不含`Access-Control-Allow-Origin`响应头字段的HTTP响应（状态码可能依旧是200 OK），浏览器判断响应中不含`Access-Control-Allow-Origin`后将抛出异常。

关于跨域的HTTP响应头字段如下：
1. Access-Control-Allow-Origin：
该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。

2. Access-Control-Allow-Credentials:
该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。这个值只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。**同时，浏览器端还需要将`XmlHttpRequest`的`withCredentials`属性同时设置为true方能真正生效。**

3. Access-Control-Expose-Headers:
该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。

## 非简单请求

### 定义

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`。

### 跨域要求

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。浏览器先用`OPTIONS`方法询问服务器，当前网页所在的域名（Origin字段）是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的`XMLHttpRequest`请求，否则就报错。

除了`Origin`字段，"预检"请求的头信息包括两个特殊字段:
1. Access-Control-Request-Method:
该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法。
2. Access-Control-Request-Headers:
该字段可选，指定浏览器CORS请求会额外发送的头信息字段。

与简单请求一样，在确认`Origin`范围后，服务器返回一个带有`Access-Control-Allow-Origin`字段的响应报文，告知浏览器可以正常跨域访问。一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

## 参考

[《跨域资源共享 CORS 详解》——阮一峰](http://www.ruanyifeng.com/blog/2016/04/cors.html)
