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

#### API

#### 查找dom

+ select

```html
<div class="div" data-id="div"></div>
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

查找dom|name|description
----|----|----
||select|查找，返回`null`或`dom`或`[dom1, dom2, ..., domN]`
||next|


