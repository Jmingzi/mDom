### Mdom.js

原生操作dom的库，兼容ie8+，对于dom的查找是缓存的

#### 使用
```html
<script src="mDom.js"></script>     
// 或
<script>
import Mdom from './mDom.js'
</script>  
```

api列表
+ [select](#select)
+ [next](#next)
+ [prev](#prev)
+ [filterBy](#filterBy)

+ [el](#el)
+ [css](#css)
+ [attr](#attr)
+ [mount](#mount)
+ [html](#html)
+ [text](#text)

#### API：查找dom

示例dom
```html
<div class="div" data-id="div"></div>
<p>hello world!</p>
```

### select

@params selector 选择器，可接受`class`或`id`或`tagName`(`.class`，`#id`，`tagName`)默认`tagName`。

```js
mDom.select('.div')
mDom.select('#div')
mDom.select('div')
```

@params option 筛选条件，一般为attributes
```js
mDom.select('div', {
  class: 'div',
  'data-id': 'div'
})
```

@return
```js
`null`或`dom`或`[dom1, dom2, ..., domN]`
```

### next

@params target // 目标节点的下一个节点

```js
mDom.next(mDom.select('.div'))
// p
```

### prev 同上

### filterBy 精确查找
```js
mDom.filterBy(mDom.select('.div'), {
  'data-id': 'div'
})
```
@params dom 被选择的节点
@params option 操作条件，一般为attributes

#### API：创建dom

### el 
创建dom对象
@params tagName 创建标签名称，为空的时候创建文本节点
@params attributes dom属性
@return 返回一个函数，接受一个参数childs，为该节点的子节点

```js
mDom.el('h1', {
    class: 'h1-class',
    style: {
        color:'red',
        'font-size': '14px'
    }
})(mDom.el('ppppp')())

// <h1 class="h1-class" style="color: red; font-size: 14px;">ppppp</h1>
```

### css
设置dom的css

```js
mDom.css(box)({color: 'red', 'font-size': '16px'})
```

### html 
@params dom 目标dom
@params html 为空时，表示获取该dom的html；否则设置innerHTML到该对象上

```js
mDom.html(box)
// box.innerHTML

mDom.html(box, '<p>hello world</p>')
```

### text 同上

### mount 将创建的dom添加到目标对象中

@params target 目标对象
@params dom 创建的dom
@return 返回一个函数，接受：

+ @params method 插入方式，默认为`append`，可选`prepend`
+ @params beforeMount 插入前回调 可选

```js
mDom.mount(document.body, h1)('prepend', ()=> console.log('before'))
```




