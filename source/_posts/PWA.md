---
title: PWA
date: 2018-07-02 14:37:11
tags: [advanced, mobile]
categories: note
---

**PWA**（Progressive Web App | 渐进式网页应用）由**Google**推出的一套实现原生App体验的Web技术方案。

## 特性

### 可靠

即时加载，并且在网络不确定的情况下也能正常显示，不会出现无网络、无连接提示的情况（Unable to connect internet）。

### 快速

以流畅的动画快速响应用户，与用户进行流畅的交互。并且不会出现滚动卡顿（Janky Scrolling）。

### 优质体验

使用体验就像是在设备上安装的本地应用程序一样，为用户带来更好的体验。

## 技术

### Service Worker

当用户在设备上发出启动应用的请求时，服务者能使渐进式Web应用快速加载，而不管网络状态如何。这样的特性依赖于`Service Worker`技术：

`Service Worker`是Chrome团队提出和力推的一个 WEB API，用于给 web 应用提供高级的可持续的后台处理能力。

![service worker](service-worker.png)

#### 原理
`Service Worker`就像介于服务器和网页之间的拦截器，能够拦截进出的HTTP 请求，从而完全控制你的网站。其实，它相当于一个离线的`Web Worker`，一个运行在浏览器端的子线程，用于在请求Web时在浏览器端调用本地缓存资源，也能做到选择从服务器获取的资源进行缓存，因此可以无需关注网络情况。

#### 缓存策略

1. Cache API缓存
    `Service Worker`本身通过[Cache API](https://developer.mozilla.org/en-US/docs/Web/API/cache)对HTTP响应的资源进行缓存，例如页面（HTML）；
2. 浏览器其他缓存机制
    除了利用`Service Worker`本身的缓存，你还可以利用`localstorage`，`indexeddb`来缓存部分资源。

#### 缓存使用

1. 网络优先
   即优先获取网络上最新的资源。当网络请求失败的时候，再去获取 service worker 里之前缓存的资源；
2. 网络条件良好
   更新`cache`中对应的缓存资源，保证下次每次加载页面，都是上次访问的最新资源；
3. 网络异常
   若找不到`service worker`中`url`对应的资源的时候，则去获取`service worker`对应的`/index.html`默认首页。

> 注：初次访问Web应用时并不会立即执行`Service Worker`，而是待所有资源加载完毕之后再执行。所以第一次加载不可能通过 fetch 事件去缓存页面。

#### 生命周期

1. Download
2. Install
3. Activate

#### API

参考：[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Manifest

`manifest`的目的是将Web应用程序安装到设备的主屏幕，为用户提供更快的访问和更丰富的体验。通过`JSON`配置程序图标及应用信息，使之更加贴近真实的本地应用。

#### 部署

```html
<link rel="manifest" href="/manifest.json">
```

```json
// manifest.json
{
  "name": "HackerWeb",
  "short_name": "HackerWeb",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#fff",
  "description": "A simply readable Hacker News app.",
  "icons": [{
    "src": "images/touch/homescreen48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen96.png",
    "sizes": "96x96",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen144.png",
    "sizes": "144x144",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen168.png",
    "sizes": "168x168",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen192.png",
    "sizes": "192x192",
    "type": "image/png"
  }],
  "related_applications": [{
    "platform": "web"
  }, {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  }]
}
```

## 缺陷

目前PWA的技术尚不成熟，虽然IOS也加入实现的行列，但不可否认，尚有很多平台没有实现相关支持。

## 参考

[Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
[Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
