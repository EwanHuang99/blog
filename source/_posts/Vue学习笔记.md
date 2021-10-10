---
title: Vue学习笔记
date: 2017-12-28 14:23:52
tags: [vue, js]
categories: note
---
接了第一个前端的外包项目，为一个德国的药业公司开发一个公众号的前端界面，其中包括了一款类似支付宝中“蚂蚁森林”的Web应用。为了简化开发流程，我学习了vue，用于模块化开发。一下是对此次学习中的重点、难点总结。

## MVVM
MVVM是Model-View-ViewModel的缩写。它采用双向绑定（data-binding）：View的变动，自动反映在 ViewModel，反之亦然。

### 数据双向绑定
vue采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

## 语法

### 模板语法
与其他框架不同，vue没有对HTML结构和语法进行太多的修改，而是采用模板的方式，分离页面的视图（HTML）与操作（JS）部分。而数据的植入也通过属性绑定或者通过`moustache`（两个花括号包裹）的方式。如此一来，对以往的代码就有了较强的复用性。当然，也可以直接通过`render`函数像`react`一样使用`JSX`语法。

### 数据绑定
对于`class`、`style`等HTML属性，`vue`提供了`v-bind`方法，用于绑定`vue`所提供的值。`v-bind:`也可直接简写为`:`。
```html
<div v-bind:class="{value: true}"></div> 
<!-- 等于<div :class="{value: true}"></div> -->
```

对于单向绑定的纯文本内容数据（只有modle改变时才会改变插值），既可以通过`moustache`方式引入，也可以用`v-text`。
```html
<p v-text="hello world"></p> 
<!-- 等于 <p>{{'hello world'}}</p> -->
```

对于需要被解析的文本内容，可以使用`v-html`属性。
```html
<p v-html="<span>hello world</span>"></p>   
<!-- 等于 <p><span>hello world</span></p> -->
```

对于表单中的双向绑定数据，使用`v-model`绑定。
```html
<input v-model="hi"></input>
```

### 事件绑定

- 绑定事件的方法比数据绑定较为统一，均使用`v-on:`加事件名，也可缩写为`@`。
```html
<div v-on:click="func"></div>
<!-- 等于<div @click="func"></div> -->
```

- 事件修饰符，用于处理事件调度各个阶段：
```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>
```
详见：[https://cn.vuejs.org/v2/guide/events.html](https://cn.vuejs.org/v2/guide/events.html)

### 计算属性与侦听属性
- 计算属性
**计算属性**（computed）是一种带有缓存的数据机制。其默认只含有`getter`方法。不同于普通方法，每次调用方法时都会重新运行计算。而计算属性的缓存特点保证了只要属性依赖不发生改变，每次调用时都能快速获取属性值。

- 侦听属性
**侦听属性**（watch）提供了一个更通用的方法，来响应数据的变化。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

### v-if与v-show
`v-if`是真正的条件渲染，当条件为否时，忽略其中的部分，不加载到DOM树中。而`v-show`则是一种`display`切换，会在DOM中保留对应的元素。

### 列表渲染中的:key
当 Vue.js 用`v-for`正在更新已渲染过的元素列表时，它默认用**就地复用**策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，尽可能在使用`v-for`时给每一项绑定一个特殊的`key`属性。

```html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

## 生命周期
Vue2.0对Vue组件的生命周期进行了简化，使之更方便理解与记忆：

![lifecycle](lifecycle.png)

## 组件通信

### 父组件向子组件传递数据
在子组件的`props`属性上，添加对外开放的接口，用于接受父组件传递的数据。父组件使用子组件时，使用`v-bind`绑定子组件对应的接口即可向其传递数据：
子组件：
```js
props: [childMsg];
```

父组件：
```html
<Child :child-msg="msg"/>
<!-- 此处必须用 - 代替驼峰 -->
```
### 子组件向父组件传递数据
在子组件的方法中，调用`this.$emit(func, message)`即可调用父组件绑定的方法`func`并传递数据`message`。父组件调用子组件时，只需使用`v-on`绑定方法即可调用。
子组件：
```js
methods: {
    up() {
        this.$emit('func', 'hello');
    }
}
```

父组件：
```html
<Child @func="fatherFunc"/>
<!-- fatherFunc为父组件方法，可接收到子组件传递的数据 -->
```

## vue2.0注意事项
在vue2.0中，`v-for`在遍历值时，如果同时获取`index`和`item`，`index`与`item`的位置与vue1.0中的正好相反：
```html
<!-- vue1.0 -->
<div v-for="(index, item) in items">
    {{index + item}}
</div>

<!-- vue2.0 -->
<div v-for="(item, index) in items">
    {{index + item}}
</div>
```
