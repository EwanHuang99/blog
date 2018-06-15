---
title: JavaScript基础（二）
date: 2017-11-19 14:09:17
tags: [basis, js]
categories: note
---
## 面向对象编程

### 创建对象的方法

- Object实例创建
```js
var person = new Object();
person.name = 'berry';
```
- 字面量创建
```js
var person = {
    name: 'berry',
    age: 20
};
```
- 构造器（Constractor）创建
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
var berry = new Person('berry', 20);
```

### 数据属性与访问器属性
ECMAScript 中有两种属性：数据属性和访问器属性。

- 数据属性：
1. [[Configurable]]：表示能否通过delete 删除属性从而重新定义属性，能否修改属性的特
性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的
这个特性默认值为true。
2. [[Enumerable]]：表示能否通过for-in 循环返回属性。像前面例子中那样直接在对象上定
义的属性，它们的这个特性默认值为true。
3. [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的
这个特性默认值为true。
4. [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，
把新值保存在这个位置。这个特性的默认值为undefined。

- 访问器属性：
1. [[Configurable]]：表示能否通过delete 删除属性从而重新定义属性，能否修改属性的特
性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为
true。
2. [[Enumerable]]：表示能否通过for-in 循环返回属性。对于直接在对象上定义的属性，这
个特性的默认值为true。
3. [[Get]]：在读取属性时调用的函数。默认值为undefined。
4. [[Set]]：在写入属性时调用的函数。默认值为undefined。
```js
var book = {
_year: 2004,
edition: 1
};
Object.defineProperty(book, "year", {
    get: function(){
        return this._year;
    },
    set: function(newValue){
        if (newValue > 2004) {
        this._year = newValue;
        this.edition += newValue - 2004;
    }
}
});
book.year = 2005;
alert(book.edition); //2
```

> 修改对象属性有两种方法：`Object.defineProperty(obj, value, {attributes})`和`Object.defineProperties(obj, {value: {attributes}......})`。
> 获取对象属性的方法： `Object.getOwnPropertyDescriptor(obj, value)`。
> ECMAScript 5 的`Object.keys()`方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组。
> 如果你想要得到所有实例属性，无论它是否可枚举，都可以使用`Object.getOwnPropertyNames()`方法。
### 原型

- prototype
每个`Function`对象都有一个`prototype`属性，该属性指向通过调用构造函数而创建的那个对象实例的原型对象。所有通过同一个构造函数创建的对象都共享一个`prototype`。
```js
function Person() {}
Person.prototype.name = 'berry';
var person1 = new Person();
var person2 = new Person();
alert(person1.name);    // 'berry'
alert(person2.name);    // 'berry'
```
    每个函数的`prototype`上都默认有一个`constractor`属性，该属性指向`prototype`所属的函数。如上例：
    ```js
    Person === Person.prototype.constuctor; //true
    ```
    > 判断一个对象是否为另一个对象的原型，可以调用`isPrototypeOf()`方法:
    ```js
    Person.prototype.isPrototypeOf(person1) // true
    ```

- 原型查找
Person的每个实例——:person1 和person2 都包含一个内部属性，该属性仅仅指向了Person.prototype；换句话说，它们与构造函数没有直接的关系。当我们查询某一对象的属性时，如果对象上没有这个属性，就会像对象的构造函数上的原型对象上查找，若没有找到，则返回`undefined`。

    > 因此，调用`for-in`循环同时也会遍历到对象原型上的**可枚举**属性。

- 判断属性是否属于原型对象
`hasOwnProperty()`是`prototype`上的方法，可以通过该方法知道，对象所访问的属性是属于对象本身的，还是原型上的。

- 对象或许原型的方法
`Object.getPrototypeOf()`，在所有支持的实现中，这个方法返回`Prototype`的值。
```js
Object.getPrototypeOf(person1) == Person.prototype  // true
```
    > 在浏览器环境中，每个对象上还有一个`__prop__`属性，指向对象构造函数的原型，该属性与`Object.getPrototypeOf()`作用相同。但应避免使用它，因为它只在浏览器环境中存在。

- 重写原型
重写原型对象切断了现有原型与任何之前已经存在的对象实例之间的联系；它们引用的仍然是最初的原型。

- 缺点
原型上的属性对于所有实例共享。

### 继承

- 原型链
ECMAScript 中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

- 原型链继承
1. 直接将父类的实例作为子类的原型：
```js
function Person() {}
var father = new Person();
function Son() {}
Son.prototype = father;
var son = new Son();
son instanceof Person; // true
son instanceof Son; // true
```
2. 方法一存在的问题是，父类的所有属性和方法都将被继承。改善后，将父类可被继承的属性放在父类的原型上，让子类指向父类的原型：
```js
function Person() {}
function Son() {}
Son.prototype = Person.prototype;
var son = new Son();
son instanceof Person; // true
son instanceof Son; // true
```
3. 方法二存在一个巨大的缺点，当修改子类的原型时，会影响到父类，特别是如果子类重写父类的方法并放在原型上时。改善过后的方法是，让子类原型对象的原型指向父类的原型：
```js
function Person() {}
function Son() {}
Object.setPrototypeOf(Son.prototype, Person.prototype); // 或Son.prototype.__prop__ = Person.prototype;
var son = new Son();
son instanceof Person; // true
son instanceof Son; // true
```
    > 缺点：
    > 1. 要想为子类新增属性和方法，必须要在new Animal()这样的语句之后执行，不能放到构造器中
    > 2. 无法实现多继承
    > 3. 来自原型对象的引用属性是所有实例共享的
    > 4. 创建子类实例时，无法向父类构造函数传参

- 构造继承
解决了原型继承中，子类实例共享父类引用属性的问题。创建子类实例时，可以向父类传递参数。可以实现多继承。
```js
function Person() {}
function Son(name) {
    Person.call(this);
    this.name = name;
}
var son = new Son('berry');
son instanceof Person; // false
son instanceof Son; //true
```
    > 缺点：
    > 1. 实例并不是父类的实例，只是子类的实例
    > 2. 只能继承父类的实例属性和方法，不能继承原型属性/方法
    > 3. 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

- 寄生继承
为父类实例添加新的属性，作为子类实例返回：
```js
function Person() {}
function Son(name) {
    var instance = new Person();
    instance.name = name;
    return instance;
}
var son = new Son('berry');
son instanceof Person; // true
son instanceof Son; // false
```
    > 缺点：
    > 1. 本质上实例依旧是父类实例，不是子类实例；
    > 2. 无法实现多继承。

- 拷贝继承
在构造函数中对父类可枚举属性进行拷贝：
```js
function Person() {}
function Son(name) {
    var father = new Person();
    for (var attr in father) {
        Son.prototype[attr] = father[attr];
    }
}
var son = new Son();
son instanceof Person; // false
son instanceof Son; // true
```
    > 缺点：
    > 1. 效率较低，内存占用高;
    > 2. 无法获取父类不可枚举的方法（可以用`Object.getOwnPropertyNames()`弥补）。

- 组合继承
调用父类构造器后，将子类的prototype指向父类，**然后将子类的contructor重新指向子类构造器**。
```js
function Person() {}
function Son() {
    Person.call(this);
}
Son.prototype = new Person();
Son.prototype.constructor = Son;
var son = new Son();
son instanceof Person; // true
son instanceof Son; // true
```
    > 缺点：
    > 1. 调用了两次父类构造函数，生成了两份实例。

- 寄生组合继承
结合了组合继承于寄生继承：创建一个空函数作为中间介质，让函数的原型指向父类的原型。
```js
function Person() {}
function Son() {
    Person.call(this);
}
function Empty() {}
Empty.prototype = Person.prototype;
Son.prototype = new Empty();
Son.prototype.constructor = Son;
```
    > 缺点：
    > 实现较为复杂

## 函数式编程

"函数式编程"是一种"编程范式"（programming paradigm），也就是如何编写程序的方法论。它属于"结构化编程"的一种，主要思想是把运算过程尽量写成一系列嵌套的函数调用。

### 纯函数

纯函数指只有输入决定输出的函数。即，对于相同的输入，输出永远相同。落到实处即函数本事的结果和运算不依赖自身以外的可变值：外部变量、Math.random()、Date等。

```js
// 纯函数
function add(a, b) {
    return a + b;
}

// 非纯函数
x = 50;
function add2(y) {
    return x + y;
}
```

### Curry化

函数Curry化即只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
function operation (a, b) {

    return function operation2 (c) {
        return (a + b) * c;
    }
}
```

## 参考
《JavaScript高级程序设计》
[《JS继承的实现方式》](https://www.cnblogs.com/humin/p/4556820.html)
[《JS函数式编程指南》](https://legacy.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)