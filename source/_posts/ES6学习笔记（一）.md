---
title: ES6学习笔记（一）
date: 2018-01-12 21:49:11
tags: [advanced, js, ECMAScript]
categories: note
---
## 类型扩展

### let与const声明
`let`与`const`是ES6新增的变量声明方式，前者用于定义块级作用变量，后者用于定义块级作用域常量。

#### 使用
1. let
`let`声明弥补了ECMAScript没有块级作用域的缺憾。用`let`声明的变量仅在块级作用域内有效：
```js
for(let i = 0; i < 5; i++) {}
console.log(i); // undefined
```

2. const
`const`用于声明常量。与`let`一样，只在块级作用域内有效。声明时必须初始化常量，且此后不得修改。如果未初始化常量或者声明后修改，都会抛出错误。`const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。
```js
const Ewan = 'Ewan';
Ewan = 'a'; // TypeError: Assignment to constant variable
const b; // SyntaxError: Missing initializer in const declaration
```
#### 注意
- `let`与`const`不存在变量提升，即一旦使用其中一个声明变量，声明变量之前的区域成为**暂时性死区**，在同级作用域中重复声明将报错。
- 在全局作用域中用`let`、`const`、`class`声明的变量、常量、对象将不会像通过`var`和`function`声明的一样绑定在顶层对象（window或global）上。
- `const`只能限制对象与引用的绑定关系，对象上的属性不受`const`限制。
- `for`循环中使用`const`与`let`不同于`var`，每次循环都类似于一个新的作用域，所以可以直接传值给异步方法，保证事件循环结束后变量不受影响。

### 解构赋值

#### 数组解构赋值：
```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

#### 对象解构赋值：
```js
let { bar, foo } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined

let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

var {x, y = 5} = {x: 1}; // 默认值
x // 1
y // 5

var {x: y = 3} = {x: 5};
y // 5
```

#### 数值和布尔值的解构赋值：
```js
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

#### 函数参数的解构赋值：
```js
function add([x, y]){
  return x + y;
}
add([1, 2]); // 3

// 默认值1：
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

// 默认值2：
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

### 字符串扩展
1. includes()；
2. startsWith()；
3. endsWith()；
4. codePointAt()：正确处理4个字节的字符，返回一个字符的码点；
5. fromCodePoint()：可以识别大于0xFFFF的字符，弥补了String.fromCharCode方法的不足；
6. repeat(n)：返回一个重复原字符串n（取整）次的字符串；
7. padStart(length, str)/padEnd(length, str)：在字符串头/尾补上字符串str使其满足length长度（若length小于原字符串长度则返回原字符串）；
8. 模板字符串：在ES6中引入了用反引号 ( \` ) 包括的模板字符串，模板中将保留所有输入格式（包括空格、换行符等空白符），也可以通过`${x}`的方式在模板中嵌入JS表达式和返回值函数，同时它也会过滤（转义）HTML字符串：
```js
let name = 'huangyufeng';
`<h1>My name is ${name}</h1>`
// <h1>My name is huangyufeng</h1>
```
9. 标签模板：模板字符串可以紧跟在函数名后，该函数将被调用来处理这个模板字符串：
```
alert`123`
// 等同于
alert([123])
```

> 1~3第二个参数表示开始搜索位置

### 正则扩展

#### u修饰符
`u`修饰符，含义为“Unicode 模式”，用来正确处理大于`\uFFFF`的`Unicode`字符。也就是说，会正确处理四个字节的`UTF-16`编码。`.`也只能在该模式下匹配码点大于`0xFFFF`的`Unicode`字符。
```js
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^.$/u.test('𠮷') // true
```

#### y修饰符
`y`修饰符相当于在正则表达式之前加上了`^`，每次匹配时要求必须以匹配位开头。因此`y`也被叫做“粘连”（sticky）修饰符。
```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null
```

#### s修饰符：dotAll
ES2018 引入s修饰符，使得.可以匹配任意单个字符，包括空白符。
```js
/foo.bar/s.test('foo\nbar') // true
```

#### flags属性
ES6 为正则表达式新增了flags属性，会返回正则表达式的修饰符。
```js
/abc/s.flags === 's' // true
```

#### 具名组匹配
在过去ES5的标准中，正则表达式可通过圆括号方式进行组匹配：
```js
const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj[1]; // 1999
const month = matchObj[2]; // 12
const day = matchObj[3]; // 31
```
ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用:
```js
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31
```

### 数值扩展

#### 2进制与8进制
ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示：
```js
0b111110111 === 503 // true
0o767 === 503 // true
```

#### Number.isFinite(), Number.isNaN(), Number.isInteger()
1. 用于判断是否为非`Infinite`（无限）；
2. 后者用于判断是否为`NaN`；
3. 用于判断是否为整数。

#### Number.parseInt(), Number.parseFloat()
ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

#### Math.trunc()
用于去除一个数的小数部分，返回整数部分。

### 函数扩展

#### 参数默认值
ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。
```js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
```

> 注：参数变量是默认声明的，所以不能用let或const再次声明。
```js
function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}
```

> 注：参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。
```js
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

> 注：如果默认值参数不是尾参数，则不可省略其他参数
```js
function f(x = 1, y) {
  return [x, y];
}

f() // [1, undefined]
f(2) // [2, undefined])
f(, 1) // 报错
f(undefined, 1) // [1, 1]
```

> 注：指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。

#### Rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```js
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
```

#### 箭头函数
ES6 允许使用“箭头”（=>）定义函数。
```js
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};
```

> 注：
> 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。
> 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误。
> 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用`rest`参数代替。
> 不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数。

> 注：由于箭头函数本身没有自己的`this`、`super`、`arguments`，因此也不支持依赖这些属性的方法（如`bind`、`call`、`apply`等）。箭头函数也就不能通过以上方式修改`this`指向。

#### 双冒号运算符
箭头函数并不适用于所有场合，所以现在有一个提案，提出了“函数绑定”（function bind）运算符，用来取代call、apply、bind调用：
```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```

#### 尾调用优化
尾调用（Tail Call）是函数式编程的一个重要概念，指某个函数的最后一步返回**调用**另一个函数：
```js
function f(x){
  return g(x);
}
```

**优化**
函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）。

“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。

**尾递归**
递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但利用对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

#### 严格模式
ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

## 数组扩展

### 扩展运算符
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

### Array.from
该方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

### find() 和 findIndex()
数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
```js
[1, 4, -5, 10].find((n) => n < 0)
// -5
```

数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```js
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```

### 数组实例的 entries()，keys() 和 values()
ES6 提供三个新的方法——entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

### includes() 略

### 空位
ES6 则是明确将空位转为undefined。

## 对象扩展

### Object.assign()
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
```js
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

> 注：Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
```js
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2
```

### 属性的可枚举性和遍历

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。

> 注：目前，有四个操作会忽略enumerable为false的属性：
> for...in循环：只遍历对象自身的和继承的可枚举的属性。
> Object.keys()：返回对象自身的所有可枚举的属性的键名。
> JSON.stringify()：只串行化对象自身的可枚举的属性。
> Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

### 替代__prop__

该属性没有写入 ES6 的正文，而是写入了附录，原因是__proto__前后的双下划线，说明它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的`Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替。

#### Object.setPrototypeOf()
```js
Object.setPrototypeOf(object, prototype)
```

#### Object.getPrototypeOf()
```js
Object.getPrototypeOf(obj);
```

### super

`super`关键字指向对象原型。只能用在对象的方法之中，用在其他地方都会报错。JavaScript 引擎内部，`super.foo`等同于`Object.getPrototypeOf(this).foo`（属性）或`Object.getPrototypeOf(this).foo.call(this)`（方法）。

### 对象的扩展运算符

ES2018将`...`这个运算符引入了对象。对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
```js
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```

> 注：如果扩展运算符的参数是null或undefined，这两个值会被忽略，不会报错。

## Symbol

ES6引入了一种新的原始数据类型`Symbol`，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：`undefined`、`null`、布尔值（`Boolean`）、字符串（`String`）、数值（`Number`）、对象（`Object`）。

Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是**独一无二**的，可以保证不会与其他属性名产生冲突。

### 生成Symbol对象
```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

> 注：Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。
```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

> 注：虽然Symbol 值可以显式转为字符串与布尔值，但不能与其他类型的值进行运算，会报错。
```js
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

Boolean(sym) // true
!sym  // false

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

### 用于对象属性名
```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```
> 注：Symbol 值作为对象属性名时，不能用点运算符。

### 用于定义唯一的常量
```js
const COLOR_RED    = Symbol();
const COLOR_GREEN  = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error('Undefined color');
    }
}
```

### 遍历

Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。

`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的`Symbol`值。

### Symbol.for()，Symbol.keyFor()
有时，我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```

使用`Symbol.for()`登记过的`Symbol`可以通过`Symbol.keyFor()`获取到它的`key`值：
```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

## Set与Map

### Set

#### 基本使用
1. 声明`Set`对象：
```js
let set = new Set();
let aSet = new Set(array);
```
2. 添加元素：
```js
set.add(123);
```
3. 删除元素（return boolean）：
```js
set.delete(123);
```
4. 是否含有某元素（return boolean）：
```js
set.has(123);
```
5. 清空所有成员：
```js
set.clear();
```
6. 查询成员数量：
```js
set.size;
```

#### 用于数组去重
```js
const arr = [1, 1, 2, NaN, NaN, 4, 6, 5, 1, 5];
console.log([...new Set(arr)]);
// [1, 2, NaN, 4, 6, 5]
```
> 注：Set中去重的算法区别于`===`，它将`NaN`与`NaN`视作相等。

#### 遍历

Set 结构的实例有四个遍历方法，可以用于遍历成员：

1. keys()：返回键名的遍历器
2. values()：返回键值的遍历器
3. entries()：返回键值对的遍历器
4. forEach()：使用回调函数遍历每个成员

### WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别：
1. WeakSet 的成员只能是对象，而不能是其他类型的值：
```js
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```
2. WeakSet中的对象都是弱引用（不计入引用计数），即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

### Map

不同于JavaScript的对象（`Object`，本质上是键值对的集合<Hash 结构>），`Map`“键”的范围不限于字符串，各种类型的值（包括对象、`null`、`undefined`、`NaN`）都可以当作键。也就是说，`Object`结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

#### 基本使用
1. 声明`Map`对象：
```js
let map = new Map();
let aMap = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
```
2. 添加键值对：
```js
map.set(key, value); // key可为Object
```
3. 获取值：
```js
map.get(key); // value
```
4. 判断键是否存在：
```js
map.has(key); // boolean
```
5. 删除键值对：
```js
map.delete(key); // boolean
```
6. 清空键值对：
```js
map.clear();
```
7. 键值对数量：
```js
map.size;
```

#### 遍历
Map 结构原生提供三个遍历器生成函数和一个遍历方法。

1. keys()：返回键名的遍历器
2. values()：返回键值的遍历器
3. entries()：返回所有成员的遍历器
4. forEach()：遍历 Map 的所有成员

### WeakMap

`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。但`WeakMap`与`Map`的区别有两点。

1. `WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。
2. `WeakMap`的键名所指向的对象，不计入垃圾回收机制。

## Promise

### 定义

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个基于`micro task`的异步操作）的结果。从语法上说，`Promise`是一个对象，从它可以获取异步操作的消息。`Promise`提供统一的API，各种异步操作都可以用同样的方法进行处理。

### 状态

Promise对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：
> `pending` -> `fulfilled`;
> `pending` -> `rejected`。

### 基本使用

1. 声明`Promise`并执行第一个任务：
```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，**由 JavaScript 引擎提供，不用自己部署。**
2. 执行异步成功后继续后续任务`then`：
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。回调函数执行完成后会默认返回一个新的`Promise`对象，因此可以很好地实现链式调用。如果显示`return`一个值，该值将作为下一次调用`then`时的参数。此外也可以自定义返回一个`Promise`对象。
3. 异常捕捉
```js
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```
`catch`可以跨越多个`then`链捕获异常，但不同于`try/catch`，如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。此外，如果`Promise`状态已经变成`resolved`，再抛出错误是无效的。
4. 异常捕捉2.0
```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```
`finally`方法用于指定不管`Promise`对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

> 注：`Promise`新建后就会立即执行。若`resolve`在同步方法中将立即同步执行，会阻塞后续JS代码。若`resolve`在异步方法中，则`Promise`的状态也将异步改变，不会阻塞后续JS代码。

```js
let promise1 = new Promise(res => {
  while(true) {}
  res();
});
console.log('finish');
// 以上代码将无限阻塞，finish无法执行

let promise2 = new Promise(res => {
  setTimeout(() => {
    console.log('finish');
    res();}
  , 0);
});
console.log('res');
// res
// finish

let promise3 = new Promise(res => {
  console.log('res');
  res();
});
console.log('finish');
// res
// finish
```

> 注：注意，调用`resolve`或`reject`并不会终结`Promise`的参数函数的执行。

```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

### 高阶方法

#### Promise.all
`Promise.all`方法用于将多个`Promise`实例，包装成一个新的`Promise`实例。
```js
const p = Promise.all([p1, p2, p3]);
```

**p的状态由p1、p2、p3决定，分成两种情况:**
1. 只有p1、p2、p3的状态都变成`fulfilled`，p的状态才会变成`fulfilled`，此时p1、p2、p3的返回值组成一个**数组**，传递给p的回调函数；
2. 只要p1、p2、p3之中有一个被`rejected`，p的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给p的回调函数。

> 注：如果作为参数的`Promise`实例，自己定义了catch方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。只有参数实例自身没有`catch`方法时才能被`Promise.all()`捕获。

#### Promise.race
`Promise.race`方法同样是将多个`Promise`实例，包装成一个新的`Promise`实例。不同于`Promise.all`的是，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的`Promise`实例的返回值，就传递给p的回调函数。

#### Promice.try
`Promice.try`作为一个新提案用于解决同步函数同步执行，异步函数异步执行的问题：
```js
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```

## async函数
ES2017 标准引入了`async`函数，使得异步操作变得更加方便。`async`表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。`async`函数的返回值是`Promise`对象。你可以用then方法指定下一步的操作。进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 `Promise`对象，而`await`命令就是内部`then`命令的语法糖。当函数执行的时候，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

### 基本使用

#### 返回Promise对象
`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。
```js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
`async`函数内部抛出错误，会导致返回的`Promise`对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。
```js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
);
// Error: 出错了

f().catch(e => console.log(e));
// Error: 出错了
```

#### Promise对象的状态变化
`async`函数返回的`Promise`对象，必须等到内部所有`await`命令后面的`Promise`对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

#### await命令
`await`命令只能出现在`async`函数环境下。在正常情况下，`await`命令后面是一个`Promise`对象。如果不是，会被转成一个立即`resolve`的`Promise`对象。
```js
async function f() {
  return await 123;
}

// 相当于
async function f2() {
  return await Promise.resovel(123);
}
```

`await`命令后面的`Promise`对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。同时，整个`async`函数执行中断。
```js
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}

f().catch(e => {
  console.log(e);
});
// ERROR 出错了
```

如果在`await`后执行了`reject`，但仍然希望不要中断后续任务，可以使用`try/catch`语句或者在`await`执行语句后再添加一句`.catch()`。
```js
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world

async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

并发`await`异步：
```js
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

### async原理

详见：[《ES6学习笔记（二）》](/2018/01/18/ES6学习笔记（二）/)

## 参考
[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)
[《ECMAScript® 2018 Language Specification》](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
