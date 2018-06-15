---
title: ES6学习笔记（一）
date: 2018-01-12 21:49:11
tags: [advanced, js, ECMAScript]
categories: note
---
## 类型扩展

### let与const声明
`let`与`const`是ES6新增的变量声明方式，前者用于定义块级作用变量，后者用于定义块级作用域常量。

1. let
`let`声明弥补了ECMAScript没有块级作用域的缺憾。用`let`声明的变量仅在块级作用域内有效：
```js
for(let i = 0; i < 5; i++) {}
console.log(i); // undefined
```

2. const
`const`用于声明常量。与`let`一样，只在块级作用域内有效。声明时必须初始化常量，且此后不得修改。如果未初始化常量或者声明后修改，都会抛出错误。`const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。
```js
const berry = 'berry';
berry = 'a'; // TypeError: Assignment to constant variable
const b; // SyntaxError: Missing initializer in const declaration
```

> `let`与`const`不存在变量提升，即一旦使用其中一个声明变量，声明变量之前的区域成为**暂时性死区**，在其中声明同样的变量会抛出错误。

### 解构赋值

1. 数组解构赋值：
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

2. 对象解构赋值：
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

3. 数值和布尔值的解构赋值：
```js
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

4. 函数参数的解构赋值：
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
1. includes()
2. startsWith()
3. endsWith()

> 第二个参数表示开始搜索位置

### 函数扩展
1. 参数默认值：

2. 箭头函数：

3. 尾调用优化：

## Symbol



## Set与Map

## Promise

## 遍历

## Class

## Module
