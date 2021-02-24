import Vue, { VNode, VNodeDirective } from 'vue'
import { on } from 'element-ui/src/utils/dom'
const ctx = '@@clickoutsideContext'

type state = {
  id: number
  documentHandler: typeof createDocumentHandler
  methodName: any
  bindingFn: any
}

type customNode = {
  [ctx]: any
} & HTMLElement

type customVNode = { context: { [key: string]: any } } & VNode

const nodeList: HTMLElement[] = []


let startClick: MouseEvent
let seed = 0

!Vue.prototype.$isServer && on(document, 'mousedown', (e: MouseEvent) => (startClick = e))

!Vue.prototype.$isServer &&
  on(document, 'mouseup', (e: MouseEvent) => {
    nodeList.forEach(node => (node as customNode)[ctx].documentHandler(e, startClick))
  })

function createDocumentHandler(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
  return function (mouseup: MouseEvent | Record<string, never> = {}, mousedown: MouseEvent | Record<string, never> = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target as Node) ||
      el.contains(mousedown.target as Node) ||
      el === mouseup.target ||
      ((vnode as customVNode).context.popperElm &&
        ((vnode as customVNode).context.popperElm.contains(mouseup.target) || (vnode as customVNode).context.popperElm.contains(mousedown.target)))
    )
      return

    if (binding.expression && (el as customNode)[ctx].methodName && (vnode as customVNode).context[(el as customNode)[ctx].methodName]) {
      (vnode as customVNode).context[(el as customNode)[ctx].methodName]({ mouseup, mousedown })
    } else {
      (el as customNode)[ctx].bindingFn && (el as customNode)[ctx].bindingFn({ mouseup, mousedown })
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    nodeList.push(el)
    const id = seed++
    (el as customNode)[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
    }
  },

  update(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {

    (el as customNode)[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    (el as customNode)[ctx].methodName = binding.expression;
    (el as customNode)[ctx].bindingFn = binding.value
  },

  unbind(el: HTMLElement) {
    const len = nodeList.length

    for (let i = 0; i < len; i++) {
      if ((nodeList[i] as customNode)[ctx].id === (el as customNode)[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete (el as customNode)[ctx]
  },
}
