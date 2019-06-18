---
title: JSON Web Token
date: 2018-08-02 00:54:46
tags: [network, server]
categories: note
---

在用**Nginx**做负载均衡时不得不考虑到一个问题——`sessionid`共享。如果通过`IP`绑定来防止`sessionid`共享则容易破坏服务器集群负载均衡的稳定性。但通过`redis`等技术（数据持久化方案）又无法避免整个服务器集群之间共享`sessionid`。为了解决这个问题，**JSON Web Token**诞生了。

## 定义

**JSON Web Token**（缩写 JWT）是目前最流行的跨域认证解决方案。它不再依赖服务端保存认证信息（session），而是将所有用户的认证信息交由客户端（浏览器等）保管，每次用户请求必须携带这些信息，服务器通过分析这些信息来验证用户。

## 原理

**JWT**的原理是，服务器认证以后，生成一个由 `JSON` 字符串（Base64URL转码）或普通字符串拼接而成的大字符串，让用户保存。`JSON`的内容可能如下：
```json
{
    "name": 123,
    "token": "fadfdgdsag",
    "maxAge": 30
}
```

## 数据结构

**JWT**的认证数据是由三个部分组成的：
1. Header（头部）
2. Payload（负载）
3. Signature（签名）

这三个部分由`.`标识符分隔组成一个字符串：
``` js
"abadfdsafdsaf.afdsafdsafsadfdsagfg.afdsafdsafasf"
// Header.Playload.Signature
```

### Header

**Header**部分是一个`JSON`对象，描述 JWT 的元数据，通常是下面的样子：
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
上面代码中，`alg`属性表示签名的算法（algorithm），默认是 `HMAC SHA256`（写成 HS256）；`typ`属性表示这个令牌（token）的类型（type），`JWT` 令牌统一写为`JWT`。

最后，将上面的 `JSON` 对象使用 `Base64URL` 算法转成字符串。

### Payload

**Payload**部分也是一个 `JSON` 对象，用来存放实际需要传递的数据。`JWT` 规定了7个官方字段，供选用:

字段|含义
:-:|:-:
iss (issuer)|签发人
exp (expiration time)|过期时间
sub (subject)|主题
aud (audience)|受众
nbf (Not Before)|生效时间
iat (Issued At)|签发时间
jti (JWT ID)|编号

当然，你也可以在其中加入一些自定义的私有字段。最后，将上面的 `JSON` 对象使用 `Base64URL` 算法转成字符串。

### Signature

**Signature**不同于上面两个字段，它是用以防止数据篡改的标识，通过复杂的算法（在**Header**中指定的**alg**）把编码后的前两个字段加上服务器端生成的**密钥**合成一个难以伪造的标签：
```js
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

> `Base64URL`类似于`Base64`编码，但它新添了转义`URL`中特定标识的功能：如`=`被忽略，`+`转义成`-`，`/`转义成`_`。

## JWT存储

**JWT**最好避免使用`cookie`存储，这样不利于跨域，同时也无法避免`cookie`禁用的情况。可以通过`localStorage`存储。

## JWT发送

**JWT**默认是不加密的（上述加密过程安全性仍然不高，虽然可以二次加密），所以应通过`https`服务来进行发送。此外，应该将**JWT**存储在`http`中的`Authorization`，或者放在`post`的请求体中。

```http
Authorization: Bearer <token>
```

## 缺陷

不同于**session**，面对**JWT**时，服务器是无状态的。因此，只要在**JWT**有效期内，服务器是没有办法让**JWT**失效的。因此，不应将其有效时间设置过长。

## 参考

[《JSON Web Token 入门教程》——阮一峰](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
