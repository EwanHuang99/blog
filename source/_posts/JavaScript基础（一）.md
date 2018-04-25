---
title: JavaScript基础（一）
date: 2017-10-25 22:43:50
tags: [basis, js]
categories: note
---

## 基础

### 特点

- 弱类型
- 解释型
    JS不同于JAVA、C等编译型语言，它仅在运行时执行，不需要提前进行编译。因此，其对平台的依赖性较低，但执行效率却不及编译型语言。此外，对于一部分逻辑和空指针BUG，JS只能在执行时才能发现，而编译型语言在编译过程中就能及时发现，所以。。。
- 单线程
    不同于JAVA等后端语言，JS在浏览器执行时只有单线程执行，不具备多线程功能，因此也不必考虑多线程中存在的资源共享问题和线程安全问题。但JS可以通过异步申请浏览器调用其他常用线程，将JS执行线程中的异步任务交给其他线程，加入到执行队列中逐个执行。
- 多范式
    JS具有**命令式**、**函数式**、**面向对象**三种变成范式。

### 基本类型

- Undefined
- Null
- Boolean
- Number
- String

可以用`typeof`操作符得到除Null之外的其他变量的具体类型，得到的值是小写类型名，而Null类型则和引用类型一样返回`object`(null表示空指针对象)。

```js
typeof 'abc'    // 'string'
typeof 1    // 'number'
typeof true // 'boolean'
typeof undefined    // 'undefined'
typeof null // 'object'
```

### 比较操作符

Javascript提供了两种比较操作符：`==`和`===`。

- `==`提供了一套隐式转换机制
```js
1 == '1' // true
undefined == null // true
0 == false // true 
1 == true // true
```

> 注1：虽然在条件判断时，`(null)`和`(undefined)`都会被当作`false`，这是由于在判断语句中调用了boolean类型的显示转换方法`Boolean(x)`，而`null`和`undefinded`和`false`之间并没有隐式转换关系；
> 注2：`NaN`作为一个特殊值，与任何值不等，包括其自身：`NaN != NaN`。判断是否为`NaN`要通过方法`isNaN()`。

- `===`表示严格等于，严格要求值与类型匹配
```js
1 === '1'   // false
undefined === null // false
'abc' === 'abc' // true
```

### 数值运算

- ECMAScript会不失时机地将伪浮点数值转换成整型类型储存，从而节省一半的储存空间。

```js
var f = 1. // 1
var f2 = 10.0 // 10
```

- JS中浮点数值最高精度为17位小数，该类型采用了IEEE754格式，IEEE754浮点计算有一个通病，即浮点的计算精确度存在一些问题。例如:

```js
var a = 0.1;
var b = 0.2;
alert(a + b);   //0.30000000000000004
```

> 因此不要做这样的判断 if(a+b == 0.3){}

- 0作为除数时，JS不会报错，而是得到`NaN`。

- 数值的范围为 Number.MIN_VALUE - Number.MAX_VALUE 超出范围则变成 (-Infinity[Number.NEGATIVE_INFINITY] || Infinity[Number.POSITIVE_INFINITY]) 不能进行计算。

### 内存问题

JavaScript具有自动垃圾收集机制，也就是说，执行环境会负责管理代码执行过程中使用的内存。具体到浏览器中的实现，则通常有两
个策略:

- 标记清除
    1. 当变量将变量标记为“进入环境”；
    2. 当变量离开环境后，将其标记为“离开环境”；
    3. 垃圾收集器会间隔运行，清空已经“离开环境”的变量。

- 引用计数
    1. 当引用一个值时，其引用次数++;
    2. 当引用次数等于0时，清掉对应内存。
> 标记清楚策略中，由于垃圾收集器是固定间隔回收内存的，所以在工作量较大的程序中效率并不是十分理想，但主流浏览器都采用这种方式。
> 引用计数面对**循环引用**时将显得力不从心，即当两个对象中均包含一个对方的引用时，这两个对象的引用次数永不为0。

- 解除引用
    当确认一个变量不再引用之后，最好将其赋值为`null`，以确保内存回收机制能回收该引用，提高回收性能。

### 引用类型

JS中除了前面提及的基本类型外，还有**引用类型**。引用类型是一种数据结构，
用于将数据和功能组织在一起。

- 引用
    引用类型的值是保存在内存中的对象。与其他语言不同，JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。

- 引用类型赋值
    与普通类型赋值不同，引用类型的赋值其实只是拷贝了对象的内存地址，因此，当一个引用变量赋值给另一个引用变量时，只是将两个变量同时指向同一个对象而已：
    ```js
    var a = new Object();
    var b = a;
    a.num = 1;
    alert(b.num)    // 1
    ```

- 类型比较
    不同于普通类型，`==`和`===`只能判断指向同一个对象的引用相等。如果要判断两个对象是否属于同一个类的实例，需要用**instanceof**：
    ```js
    [1, 2, 3, 4] == [1, 2, 3, 4]    // false 两个数组内的值虽然相同，但却是两个存储在不同内存中的对象
    [1, 2, 3] isntanceof Array  // true
    Array.isArray([1, 2, 3])    // true ES5中新增的判断Array实例的方法
    ```
    > instanceof的判断只能用于同一个全局环境之下，通俗地说，也就是跨页面使用instanceof方法并不能得到预期结果。

- Object

    - Object类型的作用类似于JS中大多数类型的顶级祖先，大多数类的实现都源于对Object的继承。
    创建Object 实例的方式有两种：

        1. 使用new 操作符后跟Object 构造函数：
        ```js
        var person = new Object();
        person.name = 'berry';
        ```

        2. 使用字面量表示法：
        ```js
        var person = {
            name : 'berry',
        }
        ```
    - 获取对象属性的两种方法：

        1. 点操作符：
        ```js
        person.name // berry
        ```

        2. 方括号语法(要访问的属性应以**字符串**的形式出现在方括号中)：
        ```js
        person['name']  // berry
        ```
    - 转换字符串方法:

        1. toLocaleString()
        以人们的使用习惯为标准转换，大多数时候与toString()输出结果没有区别，但在时间和数字（超过四位数时）会体现：
        ```js
        var a = 1234;
        a.toString(); // 1234
        a.toLoacleString(); // 1,123

        var d = new Date();
        d.toString() // "Wed Oct 25 2017 23:05:48 GMT+0800 (中国标准时间)"
        d.toLocaleString() // "2017/10/25 下午11:05:48"
        ```
        2. toString()
        转换字符串，对于数组而言，转换结果中每个元素以逗号分隔。
        3. valueOf()
        与toString()类似。**但前者偏向显示，后者偏向运算**。

    > 在进行对象转换时（例如:alert(a)）,将优先调用toString方法，如若没有重写toString将调用valueOf方法，如果两方法都不没有重写，但按Object的toString输出。
    > 在进行强转字符串类型时将优先调用toString方法，强转为数字时优先调用valueOf。
    > 在有运算操作符的情况下，valueOf的优先级高于toString。

- Array

    - Array类型的创建方式
    ```js
    var colors = new Array();
    var colors = new Array(3);
    var colors = new Array("blue", "red", "green");
    var colors = Array(3);

    var colors = ["red", "blue", "green"];
    var values = [1, 2,]; //这样会创建2或3项的数组（IE8或之前创建3个元素）
    ```

    - 栈方法、队列方法
    ```js
    push()  //  在数组末尾添加元素
    pop()   //  删除并获得数组末尾元素
    shift() //  删除并获得数组头部元素
    unshift()   //  在数组头部插入元素
    ```

    - 常用方法
    ```js
    reverse()   // 逆序
    sort()  // 默认生序排序 回调函数可以进行修改，每次顺序传入两个元素，返回1则表示交换，0和-1则不处理
    slice(a, b) // 基于当前数组生成新数组，位置区间[a, b)
    splice(a, b)    // 从位置a开始删除b个元素
    splice(a, b, ...)   // 从位置a开始的b个元素用...替换
    indexOf(a)  // a元素的位置
    ```

    - 迭代方法
    ```js
    every(callback);    // 如果对于每一项callback运算均为true则返回true
    some(callback); // 任何一项callback运算为true则返回true
    filter(callback);   // 返回执行callback结果为true的项组成的数组
    forEach(callback);  //  对数组的每一项进行callback运算，没有返回值
    map(callback);  //  返回每一项执行callback之后的结果组成的
    ```

    - 归并方法
    ```js
    reduce(calback) // 从第一项开始，第一个参数为之前callback的运算结果，第二个参数为当前项
    reduceRight(callback)   // 反向归并
    ```
    - 删除元素
    1. 使用splice方法；
    2. `(length - a)`，删除a个元素。

- 基本包装类型
基本类型可以直接调用它们对应包装类的方法，但这并不等于基本类型和包装类型是一样的。基本类型调用包装类型的方法其实是将基本类型先转换成包装类型，调用方法结束后立即销毁生成的包装类。
> 调用`typeof`时，包装类返回`'object'`；
> 使用`instanceof`时，基本类型返回`false`。

    - Boolean
    ```js
    Boolean(a); // 把a转换成Boolean类型的对象
    ```
    - Number

    ```js
    Number.toFixed(a);  // 保留a位小数
    Number.toExponential(a);    // 指数表示法，a表示保留小数位数
    Number.toPrecision(a);    // 保留a位数字，超出的部分用指数表示法
    ```

    > ES6之前，parseInt()，parseFloat()这两个类型转换方法属于全局方法，绑定在window上。ES6之后，将这两个方法绑定在Number之上，更加合理。
    - String
    ```js
    var stringValue = "hello world";
    alert(stringValue.slice(3)); //"lo world"
    alert(stringValue.substring(3)); //"lo world"
    alert(stringValue.substr(3)); //"lo world"
    alert(stringValue.slice(3, 7)); //"lo w"
    alert(stringValue.substring(3,7)); //"lo w"
    alert(stringValue.substr(3, 7)); //"lo worl"

    alert(stringValue.slice(-3)); //"rld"
    alert(stringValue.substring(-3)); //"hello world"
    alert(stringValue.substr(-3)); //"rld"
    alert(stringValue.slice(3, -4)); //"lo w"
    alert(stringValue.substring(3, -4)); //"hel"
    alert(stringValue.substr(3, -4)); //""（空字符串）
    ```
    - Function
    每个函数都是Function 类型的实例，而且都与其他引用类型一样具有属性和方法。**利用表达式定义函数时，实质上是调用了Function的构造函数**。
    每个函数对象都包含两个属性：`prototype`和`length`。`length`表示函数参数的个数，`prototype`表示函数原型（不可枚举，下有详述）。
    每个函数对象都包含两个方法：`apply()`和`call()`用于执行函数:
    ```js
    function a(a, b, c) {};
    a.apply(window, [1, 2, 3]); // this指向window，参数以数组形式传入
    a.call(window, 1, 2, 3);    // this指向window，参数以枚举形式传入
    ```
    函数还能使用`bind(this)`方法绑定`this`并返回新的函数：
    ```js
    var b = a.bind(window);
    ```

### 作用域

- 执行环境与作用域
执行环境定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。

JS中没有块级作用域：
```js
for (var i = 0; i < 10; i++) {}
alert(i)    // 10
```

> JS中只有两种作用域：全局作用域、函数作用域。

- 作用域链
JS中的作用域呈树状结构层层加深，子级作用域可以访问父级作用域中的资源，但父级作用域却无法直接获取到子级中的资源。
> window
> |_var color
> |_function changeColor()
> &ensp;&ensp;|_var color
> &ensp;&ensp;|_swapColor()
>&ensp;&ensp;&ensp;&ensp;|_x

## 函数

### 函数定义

1. 函数声明

```js
function a () {
    // function body
}
```

2. 函数表达式：变量指向匿名函数（拉姆达函数）

```js
var a = function() {
    // function body
}
```

### 函数提升

ECMAScript在执行整个代码前，会首先把所有函数声明提升到其所在作用域的顶部，以便在作用域内任何地方都可以正常调用函数。

> 但仅限声明式定义的函数，表达式定义的函数因为没有函数声明，因此也不存在提升的情况。

### 递归

在ECMAScript中，为了避免利用表达式重新定义函数的名称，所以在使用递归时，提供了调用自身的方法`arguments.callee()`。
```js
function a () {
    // body
    a();
}
var b = a;
a = null;
b(); // ERRO b()函数体中的a()已经不存在了
```
> 严格模式下`arguments.callee()`方法出错。

### 闭包

EMACScript提供了一种重复使用变量，同时避免使用全局变量造成全局污染的方法——闭包。即返回函数作用域A中定义的某一函数B，依然可以通过B获得A中的变量：

```js
function a() {
    var n = 'hello';
    return function b() {
        return n;
    }
}
var x = a();
alert(x()); // 'hello'
```

> 这种方式的原理其实是在A返回B之后，虽然A的执行环境的作用域链被销毁了，但因为它是B作用域链中的一环，所有其活动对象依然被保存在内存中，被挂载在B的作用域链之上，所以B依然能取得A中的资源。
> 这种机制会消耗较多内存，因此，最好在调用完成之后，让变量指向`null`。

### this

this指向法则：
1. 指向调用者
2. 对于构造函数，如果function返回的是一个对象，则this指向指向返回的对象，否则指向构造函数生成的对象。

```js
function fn() {
    this.name = 'berry';
    return 1;
}
var f = new fn();
alert(f.name);  // 'berry'

function fn2() {
    this.name = 'berry';
    return {};
}
var f2 = new fn2();
alert(f2.name); // undefined
```

### 模仿块级作用域

利用立即执行函数，函数执行完之后随机销毁，因此就形成块级作用域的效果：
```js
(function a() {
    // 块级作用域
})();
```

### 定义私有变量

利用闭包：
```js
function createAccessor(obj, propName, value) {
	var accessor = {
		get: function() {
			return value
		},
		set: function(v) {
			value = v
		}
	}
	Object.defineProperty(obj, propName, {
		get: accessor.get
	})
	return accessor
}
```

> JS中没有重载

## 参考
《JavaScript高级程序设计》