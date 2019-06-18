---
title: ES6学习笔记（二）
date: 2018-01-18 21:49:38
tags: [advanced, js, ECMAScript]
categories: note
---
## 遍历

### Iterator

#### 作用
`Iterator`的作用有三个：
1. 为各种数据结构（`Array`、`Set`、`Map`等），提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

#### 原理
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

> 每一次调用`next`方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

#### 默认Iterator接口
ES6 规定，默认的`Iterator`接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。 原生具备 Iterator 接口的数据结构如下:
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

> 注：普通对象部署数组的Symbol.iterator方法，并无效果。

#### 调用场景
1. 解构赋值
2. 扩展运算符
3. for...of
4. Array.from()
5. Set()、Map()
6. Promise.all()、Promise.race()

### for...of循环
ES6借鉴`C++`、`Java`、`C#`和`Python`语言，引入了`for...of`循环，作为遍历所有数据结构的统一的方法。一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有`iterator`接口，就可以用`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator`方法。

#### 对比.forEach
`Array`及部分对象都提供了`forEach`方法遍历元素，然而`forEach`依赖回调函数执行，所以无法使用`break`、`continue`和`reutrn`中断循环执行。

#### 对比for...in
`for...of`和`for...in`都能通过简洁的语法遍历元素。然而，`for...in`遍历的是数组的键名；而且遍历键名的结果是**字符串**（即不能直接进行计算）。此外，`for...in`遍历的元素顺序未必是预期的顺序，甚至会遍历对象原型链上的可枚举属性。因此，`for...in`的设计更适合遍历对象属性。而`for...of`更适合顺序遍历数据结构内部各个元素。

## Class
ES6的`class`可以看作只是一个语法糖，它的绝大部分功能，`ES5`都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

### 构造器constuctor
`constructor`方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。该方法相当于`ES5`中定义类的`Function`。类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。

### 对象实例
通过`new`创建的`class`实例，同一个类的所有实例与`ES5`中的实例一样，均共享同一个原型。

### class表达式
与函数一样，类也可以使用表达式的形式定义。
```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

采用 Class 表达式，可以写出立即执行的 Class。
```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

### 不存在变量提升
类不存在变量提升（hoist），这一点与 ES5 完全不同。
```js
new Foo(); // ReferenceError
class Foo {}
```

### Class 的取值函数（getter）和存值函数（setter）
与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

### static静态方法
如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。父类的静态方法，可以被子类继承。

### class继承
在ES6中为`class`提供了新的继承语法（本质上仍然是ES5中的原型链式继承），通过`extends`关键字注明继承对象，**并在`constructor`中通过`super()`调用父类的构造方法**或**通过`super`调用父类属性或者方法**实现继承。
```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

> 注：`extends`除了继承`class`声明的类，还可以用来继承原生的构造函数（ES5是无法做到的，ES5中原生构造函数无法绑定`this`<被忽略>）。因此可以用来继承`Array`实现

### Mixin 模式的实现（替代多继承）
```js
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```

## Module

在 ES6 之前，社区制定了一些模块加载方案，最主要的有`CommonJS`和`AMD`两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代`CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案。

### 静态加载（编译时加载）
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。`CommonJS` 和 `AMD` 模块，都只能在运行时确定这些东西（运行时加载）。比如，`CommonJS` 模块就是对象，输入时必须查找对象属性。
```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```
上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

### export
`export`用于向模块外部暴露接口（对象、方法、类），不可以是某个值在export之前声明的变量、方法、类，必须与变量名称建立一一对应的关系：
```js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 等于
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export {firstName, lastName, year};

export function multiply(x, y) {
  return x * y;
};

var firstName = 'Michael';
export firstName;
// 报错

export 1;
// 报错

function f() {}
export f;
// 报错
```

### import...from
`import`用于引入`export`暴露出的接口。`from`指定引用模块的路径。
```js
// main.js
import {firstName, lastName, year} from './profile.js';
```
`import`命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同。

> 注：由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

> 注：`import`语句是**Singleton**模式。同一个模块中`import`多次同样的模块实际上只会执行一次引入操作。

### export default
`export default`用于输出匿名模块，引入它暴露的模块时`import`不需要加`{}`，并且可以随意为匿名模块指定名字。
```js
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

此外，`export default`与`export`恰恰相反，不能在其后声明变量，但却可以直接暴露已经声明的变量（不需加`{}`）。 
```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

### as

`as`用于给暴露或引入的模块重新命名。
```js
import * as x from 'xxx';

var a = 5;
export {a as abc};
```

### export与import结合
有时候，需要二次暴露引入的模块，可以使用以下语法：
```js
export {a as newA} from 'xxx';

// 等于
import {a} from 'xxx';
export {a as newA};
```

## Generator

`Generator`函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

### 函数定义
形式上，`Generator` 函数是一个普通函数，但是有两个特征。一是，`function`关键字与函数名之间有一个星号；二是，函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”）。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

### 使用

`Generator` 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。
```js
var hw = helloWorldGenerator(); // Iterator
```

下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。
```js
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

### for...of遍历

由于`Generator`函数返回的是`Iterator`，所以可以通过`for..of`的方式遍历执行：
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

### Generator嵌套yield*

如果在一个`Genrator`中使用了另一个`Generator`函数，需要在被嵌套的函数前加上`yield*`方能生效：
```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}
```

## Decorator
ES6提供了类似`JAVA`的修饰器用于修饰类及类的属性、方法，用简洁的方式设定其特性。其本质是对修饰函数的语法糖。

### 语法

`@`加上修饰符放置在被修饰对象之前。
```js
@testable
class MyTestableClass {
  // ...
}
```

### Decorator定义

以`@readOnly`只读修饰器为例，声明一个函数，接受3个参数：第一个是对应类的原型，第二个是修饰参数的属性名，第三个参数是该属性的描述对象：
```js
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}
```

### core-decorators.js提供的常见修饰符

[core-decorators.js](https://github.com/jayphelps/core-decorators)是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。

1. `@autobind`：使得方法中的`this`对象，绑定原始对象；
2. `@readonly`：使被修饰对象为只读；
3. `@override`：检查子类的方法，是否正确覆盖了父类的同名方法，如果不正确会报错。

## 参考
[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)
[《ECMAScript® 2018 Language Specification》](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
