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
const name = 'Ewan';
const element = <h1>Hello, {name}</h1>;
// <h1>Hello, Ewan</h1>
```
在这里，`<h1>Hello, {name}</h1>`既不是字符串也不是单纯的HTML DOM，而是对EcmaScript特性的设计。动态值用`{}`包裹。

### ReactDom JSX渲染
Html文档：
```html
<div id="root"></div>
```

ReactDom渲染：
```jsx
const name = 'Ewan';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(element, document.getElementById('root'));
```
效果见：[codepen](https://reactjs.org/redirect-to-codepen/rendering-elements/render-an-element)

### DOM属性
1. className
在JSX中，对应于HTML中的`class`属性的属性名为`className`。动态属性值同样用`{}`包裹。支持逻辑语句。
2. key
对于一些可重用的组件，特别是统计列表中组件变动时，React能智能地选择重用组件而不必销毁重建一个新得组件。通过给组件设定独一无二的key值就能辅助react实现这一点。
> 注：如果需要使用数组的`key`作为列表组件的`key`，应保证数组中元素索引应当是稳定的（不会出现数组反转等改变数组元素与索引对应关系的情况），否则将导致`React`难以辨别节点变化，导致意想不到的结果。
3. ref
`ref`属性允许获取某元素的**真实DOM元素**：
```jsx
render: function() {
    return <div>
        <input ref={dom => {this.dom = dom}} />
    </div>
}
```
> 注：推荐使用React 16.0后推出的`let node = React.createRef()`生成对象绑定到`ref`属性，通过`node.current`获取到当前元素对应的真实节点。或者通过上述回调函数形式的方式获取真实DOM节点。避免使用过去的`this.refs.node`方式获取节点（可能会被移除）。

### 事件绑定
1. 区别于HTML中全小写的事件绑定属性，JSX中的事件绑定用驼峰状命名法：
```html
<div onClick={handel}></div>
```

2. 在`React`中另一个不同是你不能使用返回`false`的方式阻止默认行为。你必须明确的使用`preventDefault`:
```jsx
function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
}
```

3. 与HTML中直接绑定的事件不同，所有`React`的大多数事件本质上都会绑定在`document`上，通过事件冒泡来代理组件触发的事件。在`document`上，事件的回调函数只有一个: `ReactEventListener.dispatchEvent`，然后进行相关的分发。
> 注：`React`中的事件不是真实的`DOM事件`，而是一种合成事件。因此，一次事件的触发将经历`真实DOM`到`Virtual DOM`的来回转化。因此，为了避免不必要的麻烦和处理，最好避免将真实的事件和`ReactEvent`混用。

![react-event](react-event.jpg)

## state与props

### state

`state`是一个`react`组件内部的数据结构，存储着组件内部的各种状态和数值。它只属于组件本身，应保证它具有良好的封装性。

> 注：在组件中可以通过`this.setState(newState)`来更改属性，但`this.setState()`是异步执行的，所以避免在`this.setState()`中通过修改`this.state`来改变`state`，你无法确保`this.setState`异步执行过程中`this.state`的值是否改变。同样，如果某些操作依赖新的`state`，你可以通过以下两种方式实现。

```js
// 使依赖性操作同样异步执行
setTimeout(() => {
    //...
}, 0);

// 将依赖性操作封装成this.setState()的第二个参数
this.setState(newState, () => {
    //...
});
```

### props

`props`是`react`组件对外暴露的接口，组件可以通过它获取到外部传入的数据或者方法。但基于`react`单向数据流的特性，也为了保持数据的稳定，组件本身是不允许修改自身的`props`的，如果要修改，可以通过`props`调用外部传入的方法来修改。

> 注：特殊的`props.children`是组件被使用时，开闭标签中间的内容。

## 组件生命周期（旧）

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

> 注：对于函数式编写的组件（无状态组件）来说，无法获取到声明周期的钩子函数。由于服务器渲染时`componentWillMount`会在服务器端就执行，加上`this.setState`本身异步执行的特性（无法确保render执行前修改state），所以向服务器请求初始数据时（AJAX），应将请求方法放在`componentDidMount`之中。

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

## 组件生命周期（新）

### 实例化
1. constructor()
构造器，初始化组件中的`state`、`props`数据，绑定方法执行环境，生成实例对象。
2. **static getDerivedStateFromProps(nextProps, prevState)**
组件实例化后和接受新属性时将会调用getDerivedStateFromProps。它应该返回一个对象来更新状态，或者返回null来表明新属性不需要更新任何状态。
> 注：只有在组件初始化、`props`改变、父组件重新渲染时会执行此方法。`this.setState()`通常不会触发。
3. componentWillMount() / UNSAFE_componentWillMount()
和原来的生命周期方法，不过官方添加了`UNSAFE_`标记提示开发者，该周期用于服务器端，应避免在异步请求或者修改渲染数据时使用。
4. render()
同上
5. componentDidMount()
同上

### 更新
1. componentWillReceiveProps() / UNSAFE_componentWillReceiveProps()
`UNSAFE_componentWillReceiveProps()`在装配了的组件接收到新属性前调用。若你需要更新状态响应属性改变（例如，重置它），你可能需对比`this.props`和`nextProps`并在该方法中使用`this.setState()`处理状态改变。**建议使用static getDerivedStateFromProps(nextProps, prevState)替代，17版后可能淘汰**
2. static getDerivedStateFromProps(nextProps, prevState)
同上
3. shouldComponentUpdate()
同上
4. componentWillUpdate() / UNSAFE_componentWillUpdate()
在`shouldComponentUpdata()`不返回`false`时调用。但17版后可能失效。
5. render()
同上
6. **getSnapshotBeforeUpdate()**
`getSnapshotBeforeUpdate()`在最新的渲染输出提交给DOM前将会立即调用。它让你的组件能在当前的值可能要改变前获得它们。这一生命周期返回的任何值将会 作为参数被传递给`componentDidUpdate()`。
7. componentDidUpdate()
新增第三个参数（从getSnapshotBeforeUpdate()中获得的）。

### 销毁
1. componentWillUnmount()
同上

### 错误捕捉
1. componentDidCatch(error, info)
（详见错误边界）

## React渲染

### 单向数据流
数据只能从父级组件向子级组件单向流动。

### Virtual Dom
一个Web界面的结构由树状的各个DOM节点构成。通常情况下，我们可以通过JS来直接操控DOM节点，对其进行修改。但对于交互较多的页面，不断修改DOM节点会造成大量的重绘、重排，给浏览器造成巨大的负担。因此，React将DOM节点树抽象成Virtual DOM组成的树，当数据更新时，生成一棵新的树，将之与之前的虚拟DOM树进行对比即可知道是否需要对真实节点进行修改。这样的行为大大减轻了浏览器的负担。

### 非受控组件
`react`将原始的大多数HTML元素都封装成对应的**受控组件**（可以用`JSX`的方式绑定事件，事件也是`react`自定义的合成事件），但仍然有一些组件是没有被包装的。比如`<input type="file"/>`。对于这些组件，绑定`react`定义的事件是无法得到预期效果的。因此，需要通过下列的方式获取到他们对应的真实`DOM节点`，通过原生的方法来操作。

### 获取真实组件
- `this.refs[refName]`：
该方法只适用于HTML标签上，将来可能会被移除：
```html
<div ref="div"></div>
<!-- 设定HTML引用 -->
```
    ```jsx
    this.refs.div; // 获取真实DOM
    ```

- `React.createRef`方法:
该方法出现在react 16.0版本之后，通过React API绑定节点:
```jsx
let node = React.createRef();

<input type="text" ref={node}/>

// 获取真实节点
node.current
```

- 回调函数获取：
该方法是将真实的DOM作为回调函数的参数传入，然后进行处理：
```jsx
let realNode;
<input type="text" ref={(node) => {realNode = node}}/>
```

> 注：`ref`式地绑定DOM节点只能作用于原生的HTML之上（input，div等），如果作用在自定义组件上，只能获取到组件的**实例**，而非真实的DOM节点。如果要强行获取（不建议）自定义组件的DOM节点，可以通过如下的方式。

- `ReactDOM.findDOMNode()`方法：
将自定义组件实例作为参数即可获取到自定义组件`render`中的DOM节点，但通常不建议如此（破坏组件的封装性）：
```jsx
let realNode;
<MyComponent ref={instance => {realNode = ReactDOM.findDOMNode(instance)}}/>
```

### diff算法
传统的diff算法通过循环递归来对节点进行依次比较还计算一棵树到另一棵树的最少操作，算法复杂度为O(n^3)，其中n是树中节点的个数。尽管这个复杂度并不好看，但是确实一个好的算法，只是在实际前端渲染的场景中，随着DOM节点的增多，性能开销也会非常大。而React在此基础之上，针对前端渲染的具体情况进行了具体分析，做出了相应的优化，从而实现了一个稳定高效的diff算法。

优化1：删除节点时同时删除子节点，并不在对子节点进行对比。
优化2：对于同级列表节点，React给每个节点赋予一个唯一的key属性，以帮助React定位到正确的节点进行比较，从而大幅减少DOM操作次数。

## 高级

### Context
常规情况下组件与组件之间的数据交互在`react`中都是通过父组件向子组件传递`props`来实现的。然而，对于一些嵌套较深，且中间组件除了传递`props`数据外没有其他功能的情况，`react`提供了一个类似于全局数据的API——`Context`。

API:
1. 创建一个存储全局数据的`Context`，初始值是`defaultValue`：
```jsx
export const Context = React.createContext(defaultValue);
```
2. 在高层组件中引入`Context`并向其子级组件传递:
```jsx
<Context.provider value={/* 默认值为defaultValue */}>
    <MyComponents/>
</Context.provider>
```
3. 底层组件获取从高层传入的数据：
```jsx
<div className="my-components">
    <Context.Consumer>
        {value => <input value={value}/>}
    </Context.Consumer>
</div>
```

### Fragment
在使用JSX编写一个组件时，必须保证最终返回的所有元素都要包含在一个大的元素标签中：
```jsx
render() {
    return (
        <div>
        // 其他内容
        </div>
    )
}
```
如果想要避开这样的限制，返回多内容列表的话，可以使用`Fragment`：

1. 语法糖写法：(这样不支持属性与key)
```jsx
render() {
    return (
        <>
            // 其他内容
        </>
    )
}
```

2. 附带属性值（如key）的常规写法：
```jsx
render() {
    return (
        <React.Fragment className="my-components">
            // 其他内容
        </React.Fragment>
    )
}
```

### Error Boundaries
React 16 引入了一种称为 “错误边界” 的新概念。这种方式类似于JS中的`try-catch`语句，**用于捕获其子组件树 JavaScript 异常，记录错误并展示一个回退的 UI**。

如果一个类组件定义了一个名为 componentDidCatch(error, info): 的新方法，则其成为一个错误边界：
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

使用该错误边界组件：
```jsx
<ErrorBoundary>
  <MyComponents />
</ErrorBoundary>
```

> 注：以下错误无法被错误边界组件捕获：事件处理 （了解更多）、异步代码 （例如 setTimeout 或 requestAnimationFrame 回调函数）、服务端渲染、错误边界自身抛出来的错误 （而不是其子组件）。

## 参考
[《React官方文档》](https://reactjs.org/docs/getting-started.html)
《React 引领未来的用户界面开发框架》
[《源码看React事件机制》](https://segmentfault.com/a/1190000011413181)
