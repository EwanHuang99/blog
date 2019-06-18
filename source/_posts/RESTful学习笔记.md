---
title: RESTful学习笔记
date: 2018-05-20 14:51:44
tags: [Restful, advanced]
categories: note
---

**REST**即表述性状态传递（英文：Representational State Transfer，简称REST）是Roy Fielding博士在2000年他的博士论文中提出来的一种软件架构风格。它是一种针对网络应用的设计和开发方式，可以降低开发的复杂性，提高系统的可伸缩性。满足**REST**条件的架构被认为是**RESTful**的。

## 简介

### 资源（Resources）
REST是以资源为中心的，在REST中，认为Web是由一系列的抽象资源（Abstract Resource）组成，这些抽象的资源具有不同的具体表现形式。

### 表现层（Representation）
表现层其实指的是资源的某种表现形式。譬如，定义一个资源为photo表现形式可以用用JSON，XML，JPEG等。

### 状态转化（State Transfer）
Rest是无状态的（Stateless），通信的会话状态（Session State）应该全部由客户端负责维护。访问一个网站，就代表了客户端和服务器的一个互动过程。在这个过程中，势必涉及到数据和状态的变化，这种转化是建立在表现层之上的，状态变化，通过HTTP动词实现。

## 设计原则

### 网络上的所有事物都被抽象为资源（resource）
无论是图片、视频、HTML、JSON数据...都被视为资源。

### 每个资源对应一个唯一的资源标识符（resource identifier）
网络中的各类资源或者一些虚拟服务都将通过**统一资源标识符**（URI）来进行位移的标识。

### 通过通用的连接器接口（generic connector interface）对资源进行操作
REST是基于Http协议的，任何对资源的操作行为都是通过Http协议来实现。Http把对一个资源的操作限制在4个方法以内：`GET`, `POST`, `PUT`和`DELETE`。

### 对资源的各种操作不会改变资源标识符
在对资源进行操作时，应当合理使用Http协议中提供的操作，而不应通过资源标识符的方式来提供操作。例如：`http://example.com/delete_resourse`这样的方式应当改为使用`DELETE`方法。同时，对于资源类型应当在Http的Header中的`Accept`与`Content-Type`中标识，而不应用URI区分。

### 所有的操作都是无状态的（stateless）
REST之所以可以提高系统的**可伸缩性**，就是因为它要求所有的操作都是无状态的。由于没有了上下文(Context)的约束，做分布式和集群的时候就更为简单，也可以让系统更为有效的利用缓冲池(Pool）。并且由于服务器端不需要记录客户端的一系列访问，也提高了服务器端的性能。

## 与MVC对比

直到现在为止，MVC(Model-View-Controller) 模式依然是Web开发最普遍的模式，绝大多数的公司和开发人员都采取此种架构来开发Web应用，并且其思维方式也停留于此。MVC模式由数据，视图和控制 器构成，通过事件(Event)触发Controller来改变Model和View。加上Webwork,Struts等开源框架的加入，MVC开发模 式已经相当成熟，其思想根本就是**基于Action来驱动**。

REST新的思维方式是把所有用户需求抽象为资源，这在实际开发中是比较难做到的，因为**并不是所有的用户需求都能被抽象为资源**，这样也就是说不是整个系统的结构都能通过REST的来表现。

因此，我们认为比较好的办法是混用REST和MVC，因为这适合绝 大多数的Web应用开发，开发人员只需要对比较容易能够抽象为资源的用户需求采取REST的开发模式，而对其它需求采取MVC开发即可。

## 参考

[REST框架详解](https://blog.csdn.net/dongnan591172113/article/details/52087240)
[论REST架构与传统MVC](https://blog.csdn.net/u013628152/article/details/42709033)
