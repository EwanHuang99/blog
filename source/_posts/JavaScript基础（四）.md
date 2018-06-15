---
title: JavaScript基础（四）
date: 2017-12-01 21:28:28
tags: [js, basis]
categories: note
---
## Canvas
HTML5 添加的最受欢迎的功能就是`<canvas>`元素。这个元素负责在页面中设定一个区域，然后就可以通过JavaScript 动态地在这个区域中绘制图形。
```html
<canvas id='canvas' width="600px" height="300px"></canvas>
<!-- width默认300，height默认150 -->
```
> 设定`canvas`大小时不建议用css的方式，那样仅设置了画布的大小而没有改变画布内的像素大小。

### 获取构图所用的上下文环境（2D）
```js
var canvas = document.getElementById('canvas');
if (canvas.getContext) {
    var context = canvas.getContext('2d');
}
```

### 2D上下文
2D 上下文的坐标开始于`<canvas>`元素的左上角，原点坐标是`(0,0)`。所有坐标值都基于这个原点计算，`x`值越大表示越靠右，`y`值越大表示越靠下。

- 描边与填充：
```js
context.strokeStyle = "red"; // 描边样式
context.fillStyle = "#0000ff"; // 填充样式
context.lineCap = 'round'; 
// 线条收尾样式，默认butt（平直），round（圆角），square（方形）
context.lineWidth = 10; // 线条宽度
```
- 图案绘制：
```js
context.strokeRect(x, y, width, height) // 矩形框，参数为左上角坐标、宽、高
context.fillRect(x, y, width, height) // 填充矩形
```
- 图案清除：
```js
cotext.clearRect(x, y, width, height) // 清除矩形像素
```
- 路径绘制：
```js
context.beginPath(); // 开始绘制路径

context.arc(x, y, radius, startAngle, endAngle, counterclockwise);
// 圆心坐标，半径，起始角度，终止角度，是否逆时针（默认为false，顺时针）
context.arcTo(x1, y1, x2, y2, radius);
// 从(x1, y1)到(x2, y2)绘制一条半径为radius的弧度
context.lineTo(x, y);
// 从上一点开始绘制一条直线到(x, y)
context.moveTo(x, y);
// 将图标移动到(x, y)，不画线
context.rect(x, y, width, height);
// 绘制矩形路径

contex.closePath(); // 结束路径（可选，没有则不形成封闭图形）

context.stroke(); // 描边
context.fill(); // 填充
context.clip(); // 创建裁剪区
```
![arc](/arc.jpg)
- 转换：
```js
context.scale(width, height); // 缩放，参数为宽高缩放比例
context.rotate(angle); // 旋转
context.translate(x, y); // 重新映射图形到(x, y)位置处
context.transform(a, b, c, d, e, f);
// 基于原图形变换：a：水平缩放绘图，b: 水平倾斜绘图，c: 垂直倾斜绘图，
// d: 垂直缩放绘图，e: 水平移动绘图，f: 垂直移动绘图
```
- 文本：
```js
context.font = '40px Arial'; // 字体样式
context.textAlign = 'start'; // start,end,left,right,center对齐

context.fillText(); // 绘制填充文本
context.strokeText(); // 绘制无填充文本
```
- 图像：
```js
context.drawImage(img, x, y); // 定位绘制
context.drawImage(img, x, y, width, height) // 定位+大小
context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
// (sx, sy)裁剪起始点，(swidth, sheight)裁剪宽高
```
- 像素操作：
```js
context.createImageData(width, height)	
// 创建新的、空白的 ImageData 对象
context.getImageData(x, y, width, height)	
// 返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据
context.putImageData(imgData, x, y)	
// 把图像数据（从指定的 ImageData 对象）放回画布上
```

## SVG
**SVG**是由**W3C**定义的一种由XML书写的用于网络的矢量图形。不同于Canvas，SVG绘制的图形中每一个元素都是一个可控的DOM节点。而浏览器在绘制Canvas却只是把它栅格化（像素化），一旦绘制完成就不再获得浏览器关注。Canvas依赖分辨率，而SVG不会。Canvas不支持事件处理，却有很好的重绘效率（适合游戏）。而SVG不依赖分辨率，支持事件，但重绘效率较低。

## XML
**XML**是由W3C定义的一种类似HTML的标记语言。但XML的设计宗旨是传输数据，而非显示数据。

### JavaScript创建XML数据
```js
function createXMLDom(){
    if (window.ActiveXObject) {
        var xmldoc=new ActiveXObject("Microsoft.XMLDOM");
    } else
    if (document.implementation && document.implementation.createDocument) {
        var xmldoc=document.implementation.createDocument("", "doc", null);
    }
    xmldoc.async = false;
  //为了和FireFox一至，这里不能改为False;
  xmldoc.preserveWhiteSpace=true;

  return xmldoc;
}
```

### JavaScript解析XML数据
```js
//加载XML文件。
var xmlDom = createXMLDom();
xmlDom.load("info.xml");
//获得根节点
var root = xmlDom.documentElement;
var data = "";
var names = root.getElementsByTagName("name");
var ages = root.getElementsByTagName("age");
var len = names.length;
for(var i = 0; i < len; i++) {
 data += "姓名:";
 data += names[i].firstChild.nodeValue;
 data += " 年龄:";
 data += ages[i].firstChild.nodeValue;
 data += " ";
}
alert(data);
```

## JSON
**JSON**(JavaScript Object Notation, JS 对象简谱) 是一种轻量级的数据交换格式。它基于ECMAScript的一个子集，采用完全独立于编程语言的文本格式来存储和表示数据。它不支持变量、函数或对象实例，它就是一种表示结构化数据的格式，虽然JavaScript 中表示数据的某些语法相同，但它并不局限于JavaScript 的范畴。

### JSON对象序列化
```js
JSON.stringify(jsonobj);
// 将JSON对象转换成JSON字符串
JSON.stringify(jsonobj, [a, b]);
// 将JSON对象中key为a,b的部分转换成JSON字符串
JSON.stringify(jsonobj, (key, value) {
    switch(key) {
        case 'a':
            return value;
        case 'b':
            return 123;
        default:
            return undefined;
    }
});
// 将JSON对象中的data进行处理，每个key对应的值为函数返回值（值==undefined的被忽略），转换成JSON字符串
JSON.stringify(jsonobj, null, 2);
// 将JSON对象转换成JSON字符串，每级缩进2个空白符
```
> 对于不符合JSON格式的对象，如果要转换成JSON字符串，需要添加`toJSON()`方法，定义其序列化格式。（类似`toString()`）

### JSON字符串解析
```js
JSON.parse(jsonString);
// 将JSON字符串转换成JSON对象
JSON.parse(jsonString, (key, value) => {
    switch(key) {
        // ........同stringify()方法中函数参数
    }
});
```

## AJAX
`Ajax`即“Asynchronous Javascript And XML”（异步`JavaScript`和`XML`）

### XTMLHttpRequest对象
所有现代浏览器（IE7+、Firefox、Chrome、Safari 以及 Opera）均内建`XMLHttpRequest`对象用于在后台与服务器交换数据。如果不支持，则创建`ActiveXObject`。
```js
var xhr;
if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xhr = new XMLHttpRequest();
} else {
    // IE6, IE5 浏览器执行代码
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
``` 

### 发送请求
```js
xhr.open(method, url, async);
// 通过method(GET, POST)方法打开到url的链接，async表示是否异步执行
xhr.setRequestHeader(header,value);
// 向请求添加 HTTP 头
xhr.send(null);
// 发送请求数据
```
> send()方法接收一个参数，即要作为请求主体发送的数据。如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的。

### readyState与onreadystatechange事件
- readyState
`readyState`存储着`xhr`与服务器连接的状态：

|状态值|状态|
|:-:|:-:|
| 0 | 请求未初始化 |
| 1 | 服务器连接已建立 |
| 2 | 请求已接收 |
| 3 | 请求处理中 |
| 4 | 请求已完成，且响应已就绪 |

当请求被发送到服务器时，我们需要执行一些基于响应的任务。每当`readyState`改变时，就会触发`onreadystatechange`事件。
```js
xhr.onreadystatechange = function() {
    alert(xhr.readyState);
}
```

### 请求响应

|响应属性|功能|
|:-:|:-:|
|responseText|作为响应主体被返回的文本|
|responseXML|如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的XML DOM文档|
|status|响应的HTTP 状态|
|statusText|HTTP 状态的说明|

```js
if (xhr.readyState == 4 && parseInt(xhr.status / 200) == 1) {
    alert(xhr.responseText);
}
```

### 参考
《JavaScript高级程序设计》
[www.w3school.com.cn](http://www.w3school.com.cn)
[www.runoob.com](http://www.runoob.com/)