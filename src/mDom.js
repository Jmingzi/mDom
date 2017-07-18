(function(win) {
    // 查找缓存
    const selectCache = {
        getCacheKey: function (selector, option) {
            let keyString = '', key

            if (option) {
                for (key in option) {
                    keyString += key + option[key]
                }
            }
            
            return selector + keyString
        }
    }

    // 查找对象
    var select = {
        select: function(selector, option) {
            var cache, cacheKey

            this.selector = selector
            // this.option = option

            cacheKey = selectCache.getCacheKey(selector, option)
            cache = selectCache[cacheKey]

            if (cache) {
                return cache
            } else {
                if (option) {
                    cache = this.filterByOption(this.getSelectMethod()(), option)
                } else {
                    cache = this.getSelectMethod()()
                }

                selectCache[cacheKey] = cache
                return cache
            }
        },

        next: function(target) {
            var next = target.nextSibling

            if (next && next.nodeType === 3) {
                return arguments.callee(next)
            } else {
                return next
            }
        },

        prev: function(target) {
            var prev = target.previousSibling

            if (prev && prev.nodeType === 3) {
                return arguments.callee(prev)
            } else {
                return prev
            }
        },

        selectById: function() {
            return document.getElementById(this.selector.substring(1))
        },

        selectByClass: function() {
            if (document.getElementsByClassName) {
                return this.forMatReturn(document.getElementsByClassName(this.selector.substring(1)))
            } else {
                return this.filterByOption(null, {
                    class: this.selector
                })
            }
        },

        selectByTag: function() {
            return this.forMatReturn(document.getElementsByTagName(this.selector))
        },

        querySelect: function () {
            return this.forMatReturn(document.querySelectorAll(this.selector))
        },
        
        /**
         * 将orignal Dom节点根据给定的option过滤
         * orignal {HTMLCollection/Array/Object}
         * option {Object}
         * return {null/Object/Array}
         */
        filterByOption: function(orignal, option) {
            if (!option || !orignal) {
                return orignal
            }

            var filterResult = []
            var _compareAttr = function(obj1, obj2) {
                for (var i = 0; i < obj1.length; i++) {
                    for (var obj2Key in obj2) {
                        if (obj1[i].name === obj2Key && (new RegExp(obj2[obj2Key]).test(obj1[i].value))) {
                            return true
                        }
                    }
                }
                return false
            }

            orignal = [].concat(orignal) || document.all

            for (var i = 0; i < orignal.length; i++) {
                if (_compareAttr(orignal[i].attributes, option)) {
                    filterResult.push(orignal[i])
                }
            }

            return this.forMatReturn(filterResult)
        },

        getSelectMethod: function() {
            if (document.querySelectorAll) {
                return this.querySelect.bind(this)
            } else {
                if (this.isTag()) {
                    return this.selectByTag.bind(this)
                } else if (this.isClass()) {
                    return this.selectByClass.bind(this)
                } else if (this.isId()) {
                    return this.selectById.bind(this)
                } else {
                    console.error('selector is illegal')
                }
            }
        },

        isClass: function() {
            return /\./.test(this.selector)
        },

        isId: function() {
            return /#/.test(this.selector)
        },

        isTag: function() {
            return /^\w+$/.test(this.selector)
        },

        forMatReturn: function(value) {
            if (value instanceof Object && value.length <= 1) {
                return value.length === 1 ? value[0] : null
            } else {
                return value
            }
        }
    }

    // 创建dom对象
    var create = {
        el: function(tagName, attributes) {
            // debugger
            var createDom, me = this

            return function(childs) {
                if (me.isHtmlTag(tagName)) {
                    createDom = document.createElement(tagName)

                    if (typeof attributes === 'object') {
                        createDom = me.addAttr(createDom, attributes)
                    } else {
                        createDom = me.html(createDom, attributes)
                    }

                    return me.addChild(createDom, childs)
                } else {
                    // textNode
                    return document.createTextNode(tagName)
                }
            }
        },

        css: function(dom) {
            return function(style) {
                var styleName, styleString = ''

                if (typeof style === 'object') {
                    if (dom.style) {
                        for (styleName in style) {
                            dom.style[styleName] = style[styleName]
                        }
                    } else {
                        for (styleName in style) {
                            styleString += styleName + ':' + style[styleName] + ';'
                        }
                        console.log(styleString)
                        dom.cssText = styleString
                    }
                }
            }
        },

        mount: function(target, dom) {
            return function(method, beforeMount) {
                if (typeof beforeMount === 'function') {
                    beforeMount()
                }
                
                if (!method || method === 'append' || !target.firstChild) {
                    target.appendChild(dom)
                } else {
                    target.insertBefore(dom, target.firstChild)
                }
            }
        },

        addChild: function(dom, childs) {
            if (childs instanceof Array) {
                for (var i = 0; i < childs.length; i++) {
                    dom.appendChild(childs[i])
                }
            } else {
                childs && dom.appendChild(childs)
            }

            return dom
        },

        attr: function(dom, attrs) {
            if (typeof attrs === 'string') {
                return dom.getAttribute(attrs)
            } else if (typeof attrs === 'object') {
                this.addAttr(dom, attrs)
            }
        },

        addAttr: function(dom, attrs) {
            if (attrs instanceof Object) {
                for (var attrName in attrs) {
                    
                    // style 单独处理
                    switch(attrName) {
                        case 'style': {
                            if (typeof attrs[attrName] === 'string') {
                                dom.setAttribute(attrName, attrs[attrName])
                            } else {
                                
                                // object
                                for (var styleName in attrs[attrName]) {
                                    dom.style[styleName] = attrs[attrName][styleName]
                                }
                            }
                        } break

                        default: {
                            dom.setAttribute(attrName, attrs[attrName])
                        }
                    }
                }
            } 
            
            return dom
        },

        isHtmlTag: function(tag) {
            var tags = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'pre', 'ul', 'li', 'small', 'span']

            for (var i = 0; i < tags.length; i++) {
                if (tag === tags[i]) {
                    return true
                }
            }
            return false    
        },

        text: function(dom, text) {
            if (text) {
                dom.innerText = text
                return dom
            } else {
                return dom.innerText
            }
        },

        html: function(dom, html) {
            if (html) {
                dom.innerHTML = html
                return dom
            } else {
                return dom.innerHTML
            }
        }
    }

    /**
     * 去掉选择器选项
     *
     * @param {String} selector
     * @returns {String}
     */
    function getStringBySelector (selector) {
        if (/^[\.|#]/.test(selector)) {
            selector = selector.substring(1)
        }

        return selector
    }

    // 导出对象
    var mdom = {},
        method

    for (method in select) {
        if (typeof select[method] === 'function') {
            mdom[method] = select[method].bind(select)
        }
    }

    for (method in create) {
        if (typeof create[method] === 'function') {
            mdom[method] = create[method].bind(create)
        }
    }

    if (typeof module === 'object' && typeof module.export === 'object') {
        module.export = mdom
    } else {
        win.mDom = mdom
    }
}(window))