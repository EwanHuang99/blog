---
title: JavaScript基础（三）
date: 2017-11-28 21:24:57
tags: [basis, js]
categories: note
---
## 同步与异步
Javascript语言的执行环境是**单线程**（single thread）。这意味着如果有多个JS任务，就必须排队，前面一个任务完成，再执行后面一个任务。这种模式虽然实现起来简单，但一旦有一个耗时较长的任务出现时，其他任务将被堵塞，导致浏览器长时间没有响应。为此，JavaScript提供了两种任务执行模式：**同步**（Synchronous）和**异步**（Asynchronous）。

- 同步
同步模式即以次序先后执行任务。只有排在任务队列之前的任务执行结束，后续的任务才能开始执行。

- 异步
所谓异步，即将任务单独抽离执行队列，让其在其他线程中单独执行的一种方式。JavaScript在浏览器中执行时，会有单独的JavaScript引擎线程，JavaScript的同步任务依次在此执行。而JavaScript的异步任务，则被抽离出来，由浏览器的其他**常驻线程**（如：事件触发线程、Http请求线程等）执行。JS中的异步编程有四种方法：
1. 回调函数
将执行耗时较长的任务作为回调函数，交给异步方法处理，以实现异步处理：
```js
function asy(callback) {
    setTimeout(function() {
        callback();   
    }, 0);
}
```
> 缺点:
> 不利于代码的阅读和维护，各个部分之间高度耦合，流程混乱，每个任务只能指定一个回调函数。

2. 事件监听
    - 事件循环（event loop）
    JS中的异步执行任务存放在**事件队列**（task queue）中，当**执行栈**（stack）为空时，浏览器会循环检查队列中是否有待执行任务。若有，则按照入队先后顺序依次取出任务压入执行栈中执行，待一个任务执行完毕，浏览器对页面进行渲染，然后再继续压入下一个任务继续执行。例如stTimeout()函数，浏览器会将待执行任务记录在**事件表**中，待延迟时间后，将任务压入事件队列中等待执行。
    - 事件监听编程：
    JavaScript中最常见的就是DOM中的事件监听机制。浏览器将事件对应任务记录在事件表中，当触发事件后，对应任务被立即压入事件队列等待执行：
    ```js
    function f() {
        console.log('done');
    }
    var element = document.createElement('div');
    var event = document.createEvent('HtmlEvents');
    event.initEvent('done', true, true);
    element.addEventListener('done', f);
    element.dispatchEvent(event);   // done
    ```

3. 发布/订阅（观察者模式）
被观察者订阅观察者（被观察者持有容放观察者对象的容器），当被观察者状态改变时，调用已订阅的观察者对象，观察者对象再调用相应的方法。
```js
function Event() {
    this.clientList = {};
    this.listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    this.trigger = function(key) {
        fns = clientList[key];
        if (!fns || fns.length == 0) {
            return false;
        }
        for (let f of fns) {
            f.apply(this, arguments);
        }
    };
}
var event = new Event();
event.listen('done', function() {console.log('done')});
event.trigger('done');  // done
```

4. Promise对象（ES6）
    - Microtask
    microtask 任务队列是一个与 task 任务队列相互独立的队列，microtask 任务将会在每一个 task 任务执行结束之后执行。每一个 task 中产生的 microtask 都将会添加到 microtask 队列中，microtask 中产生的 microtask 将会添加至当前队列的尾部，并且 microtask 会按序的处理完队列中的所有任务。microtask 类型的任务目前包括了 MutationObserver 以及 Promise 的回调函数。
    - Promise编程
    ```js
    const promise = new Promise((res, rej) => {
        if (true) {
            res(1);
        } else {
            rej();
        }
    });
    promise.then(num => {
        console.log(num);
    }); // 1
    ```
    详见：[ES6学习笔记（一）](/2018/01/12/ES6学习笔记（一）/)

## BOM
### window对象
在浏览器中，`window`对象有双重角色，它既是通过JavaScript 访问浏览器窗口的一个接口，又是ECMAScript 规定的`Global`对象。
- window.open(url, target)
1. url: 打开窗口的链接
2. target: 打开目标窗口（如果有对应的frame则在其中打开，没有则新建一个）。特殊窗口：_self（在当前页打开）、_parent（在父级窗口打开）、_top（在顶层窗口打开）、_blank（在新页面打开）。默认为_blank。

- 系统对话框
1. `alert()`: 提示框，只有一个确认按钮；
2. `confirm()`: 警告框，包含确认和取消按钮；
3. `prompt()`: 输入弹框。

### location对象
`window.location`和`document.location`引用的是同一个对象。location 对象的用处不只表现在它保存着当前文档的信息，还表现在它将URL 解析为独立的片段，让开发人员可以通过不同的属性访问这些片段。
![location](/location.png)
使用location 对象可以通过很多方式来改变浏览器的位置。最常用的方式是使用`assign()`方法并为其传递一个URL，就可以立即打开新URL 并在浏览器的历史记录中生成一条记录。:
```js
location.assign("http://www.huangyufeng.com");
```
如果是将`location.href`或`window.location`设置为一个URL 值，也会以该值调用assign()方法:
```js
window.location = "http://www.huangyufeng.com";
location.href = "http://www.huangyufeng.com";
```
如果要改变浏览页面，但又不想留下浏览痕迹，可以使用`replace(url)`：
```js
location.replace('http://www.huangyufeng.com'); // 当跳转离开这个页面后将无法返回
```
重新加载当前页面`reload()`：
```js
location.reload(); //重新加载（有可能从缓存中加载）
location.reload(true); //重新加载（从服务器重新加载）
```
### navigator对象
`navigator`对象包含浏览器的相关信息。可以用于查看浏览器的名称、版本、支持插件等信息。
详见：[http://www.runoob.com/jsref/obj-navigator.html](http://www.runoob.com/jsref/obj-navigator.html)

### screen对象
JavaScript 中有几个对象在编程中用处不大，而screen 对象就是其中之一。screen 对象基本上只用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。

### history对象
`history`对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。因为history 是window对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的history 对象与特定的window 对象关联。
```js
// 后退一页
history.go(-1);
// 前进一页
history.go(1);
// 前进两页
history.go(2);
// 后退一页
history.back();
// 前进一页
history.forword();
// 跳转到就近的url历史
history.go(url);
```

## DOM
DOM可以将任何HTML或XML文档描绘成一个由多层节点构成的树状结构。

### DOM结点
- Node类型
DOM1 级定义了一个Node 接口，该接口将由DOM 中的所有节点类型实现。JavaScript 中的所有节点类型都继承自Node 类型，因此所有节点类型都共享着相同的基本属性和方法。
1. nodetype属性：
每个节点都有一个nodeType属性，用于表明节点的类型。
```js
node.nodeType == 1; // ELEMENT_NODE
node.nodeType == 2; // ATTRIBUTE_NODE
node.nodeType == 3; // TEXT_NODE
node.nodeType == 9; // DOCUMENT_NODE
```

- NodeList对象
`NodeList`是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。**但NodeList并不是Array对象**。
每个DOM节点都有一个`childNodes`属性，该属性保存着一个`NodeList`对象，对象中存储着该节点的所有子节点。
1. 访问NodeList中的元素：
```js
node.childNodes[0]  // 用类似数组的方式访问
sonNode.previouSibling // 子节点的上一个兄弟节点
sonNode.nextSibling // 子节点的下一个兄弟节点
node.firstChild // 第一个子节点
node.lastChild // 最后一个子节点
```
- Node操作
```js
sonNode.parentNode == node // 子节点的parentNode属性指向父节点
node.hasNodeChilds() // 是否包含子节点
node.ownerDocument() // 获取节点所在文档节点
node.appendChild(newNode) // 在node的子节点末尾添加一个新的节点
node.insertBefore(newNode, childNode) // 在某一子节点前添加新节点
node.replaceChild(newNode, childNode) // 替换某一子节点
node.removeChild(childNode) // 移除某一子节点
node.cloneNode(bool) // 复制节点，bool表示是否深复制
node.normalize() // 删除后代节点中的空的文本节点，合并连续的文本节点
```
> 如果传入到`appendChild()`中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。

- document节点
`document`对象是HTMLDocument（继承自Document 类型）的一个实例，表示整个HTML 页面。
```js
document.documentElement; // 获得<html>的引用
document.body; // 获得<body>的引用
document.doctype; //取得对<!DOCTYPE>的引用
document.title; // 获得文档标题
document.URL; // 获取页面完整的url
document.domain; // 获取域名
document.referrer; // 取得来源页面的URL
```
> 由于浏览器对document.doctype 的支持不一致，因此这个属性的用处很有限。
>
> URL与domain是相互关联的。但是由于安全限制，只能设置为URL中包含的域。
>
> document.domain如果是松散的，则不能再设置为紧绷的。（即，不能从限制性弱的域名，修改成限制性强的域名）。

```js
document.domain = 'huangyufeng.com'; // success
document.domain = 'test.huangyufeng.com'; // error
```

`document`方法：
```js
document.getElementById(id); // 返回id="id"的节点
document.getElementsByTagName(tagName); // 返回标签名相同的节点集合NodeList
nodelist.namedItem(name); // 返回节点集合中name="name"的节点
nodelist['name']; // 通过方括号语法访问name="name"的节点
document.getElementsByName(name); // 返回name='name'的节点集合
document.write('<p>hello</p>'); // 插入文本流
document.writeln('<p>hello</p>'); // 插入文本流并换行
document.open(); // 打开网页输出流
document.close(); // 关闭网页输出流
```
> 在HTML中标签名`tagName`始终以大写表示。为了统一兼容性，最好使用`String.tolowercase()`转化后再比较tagName。

- Element节点
`Element`类型用于表现`XML`或`HTML`元素，提供了对元素标签名、子节点及特性的访问。

对于HTML元素：
```js
div.id; // 元素的id
div.className; // 元素类名
div.title; // 元素title
div.lang; // 元素内容语言代码
div.dir; // 文本方向：ltr(left-to-right)/rtl(right-to-left)
```

元素特性操作：
```js
div.getAttribute("id"); // 获取文件id属性与，参数不区分大小写
div.setAttribute("id", "idname"); // 设置id的值
div.removeAttribute("id"); // 移除id属性
```
> 对于`style`属性，在通过`getAttribute()`访问时，返回的style特性值中包含的是CSS 文本，而通过属性来访问它则会返回一个对象。
> ![style](/style.png)
> 对于`onclick`等事件属性，如果通过`getAttribute()`访问，则会返回相应代码的字符串。而在访问onclick 属性时，则会返回一个JavaScript函数（如果未在元素中指定相应特性，则返回null）。

`attributes`属性:
`Element`类型是唯一使用`attributes`属性的DOM类型。`attributes`属性中包含一个`NamedNodeMap`，与`NodeList`类似，也是一个“动态”的集合：
```js
element.attributes.getNamedItem(name); // 返回nodeName 属性等于name 的节点；
element.attributes[name]; // 同上
element.attributes.removeNamedItem(name); // 从列表中移除nodeName 属性等于name 的节点；
element.attributes.setNamedItem(node); // 向列表中添加节点，以节点的nodeName 属性为索引；
element.attributes.item(pos); // 返回位于数字pos 位置处的节点。
```

创建方法：
```js
document.createElemet(name || html tag); // 参数可以是标签名或者html标签文档
```

- Text节点
文本节点由Text类型表示，包含的是可以照字面解释的纯文本内容。纯文本中可以包含转义后的HTML 字符，但不能包含HTML 代码。**Text节点没有子节点**。

```js
textNode.appendData(text); // 将text 添加到节点的末尾。
textNode.deleteData(offset, count); // 从offset 指定的位置开始删除count 个字符。
textNode.insertData(offset, text); // 在offset 指定的位置插入text。
textNode.replaceData(offset, count, text); // 用text 替换从offset 指定的位置开始到offset+count 为止处的文本。
textNode.splitText(offset); // 从offset 指定的位置将当前文本节点分成两个文本节点。
textNode.substringData(offset, count); // 提取从offset 指定的位置开始到offset+count 为止处的字符串。
```

创建方法：
```js
document.creatTextNode(text || html node tag);
```

文本分割`splitText()`:
```js
textNode.splitText(num); // 从位置num分割文本
```

### DOM操作

- 动态脚本加载
方法1： 
```js
function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}
```

方法2：
```js
// 添加行内样式
var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function sayHi(){alert('hi');}"));
document.body.appendChild(script);
```
> 方法2在IE 中，则会导致错误。IE 将`<script>`视为一个特殊的元素，不允许DOM 访问其子节点。

方法3：
```js
var script = document.createElement("script");
script.type = "text/javascript";
// 用属性弥补兼容性
script.text = "function sayHi(){alert('hi');}";
document.body.appendChild(script);
```

- 动态样式加载
方法1：
```js
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";
var head = document.getElementsByTagName("head")[0];
head.appendChild(link);
```

方法2：
```js
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode("body{background-color:red}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```
> IE将`<style>`视为一个特殊的、与`<script>`类似的节点，不允许访问其子节点。

方法3：
```js
var style = document.createElement("style");
style.type = "text/css";
try{
    style.appendChild(document.createTextNode("body{background-color:red}"));
} catch (ex){
    style.styleSheet.cssText = "body{background-color:red}";
}
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

- 操作表格
HTML DOM为`<table>`、`<tbody>`和`<tr>`元素添加了一些属性和方法。
> 详见《JavaScript高级程序设计》 第二版 P281

### DOM元素遍历
- querySelector()方法
`querySelector()`方法接收一个CSS选择符，返回与该模式匹配的**第一个**元素，如果没有找到匹配的元素，返回null。

- querySelectorAll()方法
`querySelectorAll()`方法接收一个CSS选择符，返回与该模式匹配的所有元素的集合`NodeList`。

- matchesSelector()方法
`matchesSelector()`方法接收一个CSS选择符，如果调用元素与该选择符匹配，返回true；否则，返回false。
```js
element.matchesSelector('#id'); // 判断元素是否有id="id"
```

### H5扩展
- getElementsByClassName()方法
方法接受一个类名字符串，返回具有该类名的所有元素的集合`NodeList`。

- classList属性
该属性保存着元素中所有类名，可以通过`add(class)`、`remove(class)`、`contains(class)`、`toggle(class)`（如果存在class则移除，否则添加）来操作。

- document.readyState属性
该属性有两个值：`loading`、`complete`表示文档加载状态。

- 其他
新增`document.head`，`document.charset`，`innerHTML`（指向元素所有子节点前的集合），`outerHTML`（导出、复制元素子节点集合），`innerText`（指向元素内文本），`outerText`（输出元素内文本）。

## 事件
JavaScript与HTML之间的交互是通过事件实现的。事件，就是文档或浏览器窗口中发生的一些特定的交互瞬间。

### 事件冒泡
IE 的事件流叫做**事件冒泡**（event bubbling），即事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（文档）。
![bubble](/bubble.png)

> 对于load、unload、blur、focus、mouseleave等事件是不会发生冒泡行为的，因为这些事件只在一个特定模块发生，并不需要影响上层。

### 事件捕获
**事件捕获**（event capturing）的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。事件捕获的用意在于在事件到达预定目标之前捕获它。
![capture](/capture.png)

### DOM事件流
“DOM2级事件”规定的事件流包括三个阶段：**事件捕获阶段**、**处于目标阶段**和**事件冒泡阶段**。首先发生的是事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。
![dom event](/dom-event.png)
在DOM 事件流中，实际的目标（`<div>`元素）在捕获阶段不会接收到事件。这意味着在捕获阶段，事件从`document`到`<html>`再到`<body>`后就停止了。下一个阶段是“处于目标”阶段，于是事件在`<div>`上发生，并在事件处理中被看成冒泡阶段的一部分。然后，冒泡阶段发生，事件又传播回文档。

### 事件处理与兼容
```js
element.addEventListener(event, handler); // 添加事件
element.removeEventListner(event, handler, bool); // 删除事件
// bool默认为true，表示冒泡阶段移除。false表示捕获阶段移除。
```

IE 实现了与DOM 中类似的两个方法：attachEvent()和detachEvent()。这两个方法接受相同的两个参数：事件处理程序名称与事件处理程序函数：
```js
element.attachEvent(onevent, handler);
element.detachEvent(onevent, handler);
```

### 事件对象
兼容DOM 的浏览器会将一个event 对象传入到事件处理程序中。无论指定事件处理程序时使用什么方法（DOM0 级或DOM2 级），都会传入event 对象。
```js
var btn = document.getElementById("myBtn");
btn.onclick = function(event){
    alert(event.type); //"click"
};
```

在事件处理程序内部，对象`this`始终等于`currentTarget`的值，而`target`则只包含事件的实际目标。
```js
document.body.onclick = function(event){
alert(event.currentTarget === document.body); //true
alert(this === document.body); //true
alert(event.target === document.getElementById("myBtn")); //true
};
```

### 事件类型
- UI事件
UI 事件指的是那些不一定与用户操作有关的事件。
```js
load // 元素加载完毕
unload // 元素卸载完毕
abort // 在用户停止下载过程时，嵌入内容没有加载完
error // 加载异常
select // 选择文本框内字符
resize // 窗口变化
scroll // 页面滚动
```
- 焦点事件
```js
blur // 失去焦点
focus // 获得焦点
```
- 鼠标事件
```js
click // 单击
dblclick // 双击
mousedown // 按下鼠标键
// event.button == 1; 按下左键
// event.button == 2; 按下右键
mouseenter // 光标首次进入元素
mouseleave // 光标离开元素
mousemove // 光标在元素内移动
mouseout // 光标离开元素到其他元素内
mouseover // 光标接触元素边界
mouseup // 释放鼠标按钮
```
- 滚轮事件
```js
mousewheel // 鼠标滚动
// event.wheelDelta > 120 向上滚动
// event.wheelDelta < -120 向下滚动
```
- 文本事件
```js
textInput // 文本输入
// event.data // 文本内容
```
- 键盘事件
```js
keydown // 按下键盘任意键
keypress // 按下键盘字符
keyup // 释放键盘
// event.keyCode 输入按键的值
```
- 变动事件
```js
DOMSubtreeModified // 在DOM 结构中发生任何变化时触发。这个事件在其他任何事件触发后都会触发。
DOMNodeInserted // 在一个节点作为子节点被插入到另一个节点中时触发。
DOMNodeRemoved // 在节点从其父节点中被移除时触发。
```

### 内存与性能
在JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。导致这一问题的原因是多方面的。首先，每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。其次，必须事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。

- 事件委托
即利用实践冒泡的特点，将有大量相同的事件的元素的事件统一交给父级元素处理。父级元素接收事件后，判断事件是从哪个元素发出的（target），然后分类进行处理。

- 移除事件处理程序
移除不必要的或者影响范围过渡的事件。

## 参考
《JavaScript高级程序设计》
[《Javascript异步编程的4种方法》](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html?bsh_bid=1736591883)
[《深入理解 JavaScript 事件循环（一）— event loop》](https://www.cnblogs.com/dong-xu/p/7000163.html)
[《深入理解 JavaScript 事件循环（二）— task and microtask》](http://www.cnblogs.com/dong-xu/p/7000139.html)