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

### select

```html
<div class="div" data-id="div"></div>
<p>hello world!</p>
```

@params selector

选择器，可接受`class`或`id`或`tagName`，'.class'，'#id'，'tagName'，默认'tagName'。

```js
mDom.select('.div')
mDom.select('#div')
mDom.select('div')
```

@params option
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
```js
mDom.next(mDom.select('.div'))
// p
```

### prev 同理

### filterBy 精确查找
```js
mDom.filterBy(mDom.select('.div'), {
  'data-id': 'div'
})
```
@params dom 被选择的节点
@params option 操作条件，一般为attributes


