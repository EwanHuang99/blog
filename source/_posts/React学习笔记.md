---
title: React学习笔记
date: 2017-12-31 22:47:14
tags: [react, js]
categories: note
---

## JSX

### 基本语法
`JSX`是一种将HTML与JavaScript融合的语法：
```jsx
const name = 'berry';
const element = <h1>Hello, {name}</h1>;
// <h1>Hello, berry</h1>
```
在这里，`<h1>Hello, {name}</h1>`既不是字符串也不是单纯的HTML DOM，而是对EcmaScript特性的设计。动态值用`{}`包裹。

### ReactDom JSX渲染
Html文档：
```html
<div id="root"></div>
```

ReactDom渲染：
```jsx
const name = 'berry';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(element, document.getElementById('root'));
```
效果见：[codepen](https://reactjs.org/redirect-to-codepen/rendering-elements/render-an-element)

### DOM属性
1. className
在JSX中，对应于HTML中的`class`属性的属性名为`className`。动态属性值同样用`{}`包裹。支持逻辑语句。
2. key
对于一些可重用的组件，特别是统计列表中组件变动时，React能智能地选择重用组件而不必销毁重建一个新得组件。通过给组件设定独一无二的key值就能辅助react实现这一点。
3. ref
`ref`属性允许父组件在`render`方法之外保持对子组件的引用：
```jsx
render: function() {
    return <div>
        <input ref="myInput" />
    </div>
}

this.refs.myInput; // 获取引用组件
```

### 事件绑定
区别于HTML中全小写的事件绑定属性，JSX中的事件绑定用驼峰状命名法：
```html
<div onClick={handel}></div>
```

## 组件生命周期

### 实例化
1. getDefualtProps
每个组件类只会调用该方法一次。该方法返回的对象用于为实例设定默认的`props`值。
2. getInitialState
在组件创建实例过程中调用一次。用于初始化组件实例的`state`。在方法中可以访问`this.props`。
3. componentWillMount
组件首次渲染之前调用（`render`之前）。这也是最后修改`state`的机会。
4. render
所有组件唯一必须的方法，用于创建**虚拟DOM**。只能通过`this.state`和`this.props`访问数据。可以返回`null`，`false`和React组件。不可修改组件状态和数据。
5. componentDidMount
真实的DOM被渲染完成之后，可以通过`this.getDOMNode()`访问到真实节点。

### 存在期
1. componentWillReceiveProps
当父组件修改子组件的`props`时，子组件的`componentWillReceiveProps`方法被调用。可用于修改`props`和`state`。
2. shouldComponentUpdate
在组件更新之前调用，用于确定是否更新组件（渲染）。返回`false`表示不更新。
> 如果在首次渲染期间调用了`forceUpdate`方法后将不会调用`shouldComponentUpdate`方法。
3. componentWillUpdate
组件更新之前调用，不可通过其修改`state`和`props`。
4. componentDidUpdate
更新完成后调用。

### 销毁 & 清理期
1. componentWillUnmount
在组件从其所在层级结构中移除时调用。用于清理组件绑定的事件等任务及内存。

## React渲染

### 单向数据流
数据只能从父级组件向子级组件单向流动。

### Virtual Dom
一个Web界面的结构由树状的各个DOM节点构成。通常情况下，我们可以通过JS来直接操控DOM节点，对其进行修改。但对于交互较多的页面，不断修改DOM节点会造成大量的重绘、重排，给浏览器造成巨大的负担。因此，React将DOM节点树抽象成Virtual DOM组成的树，当数据更新时，生成一棵新的树，将之与之前的虚拟DOM树进行对比即可知道是否需要对真实节点进行修改。这样的行为大大减轻了浏览器的负担。

### 获取真实组件
- `this.refs[refName]`：
该方法只适用于HTML标签上：
```html
<div ref="div"></div>
<!-- 设定HTML引用 -->
```
    ```jsx
    this.refs.div; // 获取真实DOM
    ```

- `dom.getDOMNode()`方法:

- `ReactDOM.findDOMNode()`方法：

### diff算法
传统的diff算法通过循环递归来对节点进行依次比较还计算一棵树到另一棵树的最少操作，算法复杂度为O(n^3)，其中n是树中节点的个数。尽管这个复杂度并不好看，但是确实一个好的算法，只是在实际前端渲染的场景中，随着DOM节点的增多，性能开销也会非常大。而React在此基础之上，针对前端渲染的具体情况进行了具体分析，做出了相应的优化，从而实现了一个稳定高效的diff算法。

优化1：删除节点时同时删除子节点，并不在对子节点进行对比。
优化2：对于同级列表节点，React给每个节点赋予一个唯一的key属性，以帮助React定位到正确的节点进行比较，从而大幅减少DOM操作次数。

## 参考
《React 引领未来的用户界面开发框架》
