---
title: 计算机网络之WebSocket
date: 2017-11-08 15:00:15
tags: [basis, network, js, html5]
---
**WebSocket**是HTML5开始提供的一种在单个TCP连接上进行全双工通讯的协议。在WebSocket API中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。WebSocket 协议在2008年诞生，2011年成为国际标准。

## 连接
**WebSocket**协议本质上是一个基于 TCP 的协议。为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息"Upgrade: WebSocket"表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。

## 特点
1. 建立在 TCP 协议之上，服务器端的实现比较容易；
2. 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器；
3. 数据格式比较轻量，性能开销小，通信高效；
4. 可以发送文本，也可以发送二进制数据；
5. **没有同源限制，客户端可以与任意服务器通信；**
6. 协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是`URL`。

## 客户端API

### WebSocket 构造函数
```js
var ws = new WebSocket('ws://localhost:8080');
```

### readyState

|ws.readyState|value|状态|
|:-:|:-:|:-:|
|WebSocket.CONNECTING|0|正在连接|
|WebSocket.OPEN|1|连接成功，可以通信|
|WebSocket.CLOSING|2|连接正在关闭|
|WebSocket.CLOSED|3|连接已经关闭，或者打开连接失败|

### WebSocket.onopen
`onopen`属性指定连接成功后的回调函数。
```js
ws.onopen = function(e) {
    alert('opened');
    ws.send(null);
}
```

### WebSocket.onclose
`onclose`属性指定连接关闭后的回调函数。
```js
ws.onclose = function(e) {
    alert('closed');
}
```

### WebSocket.onmessage
`onmessage`属性指定收到服务器数据后的回调函数。
```js
ws.onmessage = function(e) {
    alert('the response is ' + e.data);
}
```
> 服务器数据可能是文本，也可能是二进制数据（blob对象或Arraybuffer对象）。

### WebSocket.send()
`send()`方法用于向服务器发送数据。
```js
ws.send('message');
```

### WebSocket.bufferedAmount
`bufferedAmount`用于判断还有多少字节的二进制数据没有发送出去（发送是否结束）。
```js
var data = new ArrayBuffer(10000000);
ws.send(data);

if (ws.bufferedAmount === 0) {
    alert('发送完毕');
} else {
    alert('发送还没结束');
}
```

## Node服务端实现
常用的 Node 实现有以下三种:
[µWebSockets](https://github.com/uNetworking/uWebSockets)
[Socket.IO](https://socket.io/)
[WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

## 参考
[《WebSocket 教程》——阮一峰](http://www.ruanyifeng.com/blog/2017/05/websocket.html)