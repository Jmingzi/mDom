(function(win) {

    class Base {
        constructor () {
            this.elem = null
            this.jsName = 'm.js'
            this.elementName = 'mElem'
            this.length = 0
        }

        log () {
            console.log(this.elem)
        }

        next () {
            let next = this.elem[0].nextSibling

            this.elem = this.toArray(next)
            if (next && next.nodeType !== 1) {
                // element
                this.next()
            }

            this.getElemLength()
            this.formatResult()

            return this
        }

        prev () {
            let prev = this.elem[0].previousSibling

            this.elem = this.toArray(prev)
            if (prev && !this.isElement(prev)) {
                this.prev()
            }

            this.getElemLength()
            this.formatResult()

            return this
        }

        siblings (selector) {
            let allChilds = this.elem[0].parentNode.childNodes
            this.elem = Array.from(allChilds).filter(elem => this.isElement(elem) && elem !== this.elem[0])

            if (selector) {
                this.elem = this.elem.filter(elem => this.hasClass(selector, elem) || this.isId(selector, elem))
            }

            this.getElemLength()
            this.formatResult()

            return this
        }

        find (option) {
            if (option) {
                this.elem = Array.from(this.elem).filter(elem => this.filterByAttr(elem.attributes, option))
            }

            this.getElemLength()
            this.formatResult()

            return this
        }

        parent (parentSelector) {
            const _setParentNode = () => {
                this.elem = this.toArray(this.elem[0].parentNode)
            }

            const _notFound = () => {
                return !this.hasClass(parentSelector) && !this.isId(parentSelector)
            }

            if (parentSelector) {
                while (_notFound()) {
                    if (this.isDocumentElem()) {
                        this.elem = null
                        break
                    }
                    _setParentNode()
                }
            } else {
                _setParentNode()
            }

            this.getElemLength()
            this.formatResult()

            return this
        }

        isChild (parentSelector) {
            return Boolean(this.parent(parentSelector).length)
        }

        hasClass (classSector, elem) {
            if (/^\./.test(classSector)) {
                return elem ? elem.classList.contains(classSector.substring(1))
                            : this.elem[0].classList.contains(classSector.substring(1))
            } else {
                return false
            }
        }

        isId (idSector, elem) {
            if (/^#/.test(idSector)) {
                return elem ? elem.id === idSector.substring(1)
                            : this.elem[0].id === idSector.substring(1)
            } else {
                return false
            }
        }

        /**
         *
         * @param {String|Object} style
         */
        css (style) {
            if (style) {
                const _StringStyle = (itemElem) => {
                    let str = ''

                    if (typeof style === 'object') {
                        for (let key in style) {
                            str += key + ':' + style[key] + ';'
                        }
                    } else {
                        str = style
                    }

                    itemElem.cssText = str
                }

                const _ObjectStyle = (itemElem) => {
                    let styleItem

                    if (typeof style === 'string') {
                        style.split(';').forEach(item => {
                            styleItem = item.split(':')
                            itemElem.style[styleItem[0]] = styleItem[1]
                        })
                    } else {
                        Object.keys(style).forEach(key => {
                            itemElem.style[key] = style[key]
                        })
                    }
                }

                Array.from(this.elem).forEach(elem => elem.style ? _ObjectStyle(elem) : _StringStyle(elem))
            } else {
                console.log('style is a String or Object')
            }

            return this
        }

        attr (props) {
            if (typeof props === 'object') {
                Object.keys(props).forEach(key => {
                    if (key === 'style') {
                        this.css(props[key])
                    } else if (key === 'innerText' || key === 'innerHTML') {
                        this.elem[0][key] = props[key]
                    } else {
                        this.elem[0].setAttribute(key, props[key])
                    }
                })
            } else {
                console.log('props is an Object')
            }

            return this
        }

        text (text) {
            if (text) {
                Array.from(this.elem).forEach(elem => elem.innerText = text)
            } else {
                return this.elem[0].innerText
            }
        }

        html (html) {
            if (html) {
                Array.from(this.elem).forEach(elem => elem.innerHTMl = html)
            } else {
                return this.elem[0].innerHTMl
            }
        }

        append (mElem) {
            if (this.isMelem(mElem)) {
                Array.from(this.elem).forEach(elem => {
                    Array.from(mElem.elem).forEach(child => elem.appendChild(child))
                })
            }
        }

        appendTo (mElem) {
            Array.from(mElem.elem).forEach(elem => elem.appendChild(this.elem[0]))
        }

        prepend () {

        }

        prependTo () {

        }

        filterByAttr (prevObj, obj) {
            let i = 0, filterKey, NamedNodeMapKey

            for (; i < prevObj.length; i++) {
                NamedNodeMapKey = prevObj[i]

                for (filterKey in obj) {
                    return NamedNodeMapKey.name === filterKey
                        && obj[filterKey] === NamedNodeMapKey.value
                }
            }

            return false
        }

        getElemLength () {
            this.length = this.elem.length
        }

        toArray (param) {
            if (param) {
                return [param]
            } else {
                return null
            }
        }

        isElement (elem) {
            return elem.nodeType === 1
        }

        isMelem (mElem) {
            return mElem && mElem.jsName && mElem.elementName && mElem.elem !== undefined
        }

        isDocumentElem () {
            return this.elem[0].tagName === 'HTML'
        }

        formatResult () {
            if (this.elem && (this.elem.length === 0 || !this.elem[0])) {
                this.elem = null
            }
        }
    }

    class M extends Base {
        constructor (selector, option) {
            super()
            this.select(selector, option)
        }

        select (selector, option) {
            if (document.querySelectorAll) {
                this.elem = document.querySelectorAll(selector)
            } else if (selector[0] === '#') {
                this.elem = this.toArray(document.getElementById(selector.substring(1)))
            } else if (selector[0] === '.') {
                this.elem = document.getElementsByClassName(selector.substring(1))
            } else if (/^\w+$/.test(selector)) {
                this.elem = document.getElementsByTagName(selector)
            } else {
                console.error('selector is illegal')
            }

            this.find(option)
        }
    }

    class El extends Base {
        constructor (tagName, props, childs) {
            super()
            this.create(tagName, props, childs)
        }

        create (tagName, props, childs) {
            // only is Element
            this.elem = this.toArray(document.createElement(tagName))
            this.attr(props)
            this.append(childs)
            this.getElemLength()
        }
    }

    function m (selector, option) {
        if (typeof selector !== 'string') {
            console.error('selector must be a string')
            return
        }

        if (option && typeof option !== 'object') {
            console.error('option must be a object')
            return
        }

        return new M(selector, option)
    }

    function el (tagName, props, childs) {
        if (typeof tagName !== 'string') {
            console.error('tagName must be a string')
            return
        }

        return new El(tagName, props, childs)
    }

    win.m = m
    win.el = el
}(window))