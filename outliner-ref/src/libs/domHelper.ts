/** 获取dom相对于某dom（默认为body）的offsetLeft、offsetTop  */
export function getOffset(el: HTMLElement, stopEl = document.body) {
  let offsetLeft = el.offsetLeft
  let offsetTop = el.offsetTop
  let parent = el.offsetParent
  //body无offsetParent
  while (parent || parent === stopEl) {
    offsetLeft += (parent as HTMLElement).offsetLeft
    offsetTop += (parent as HTMLElement).offsetTop
    parent = (parent as HTMLElement).offsetParent
  }
  return {
    offsetLeft,
    offsetTop,
  }
}

/** 
 * 找满足条件的父节点 
 * 说明：可选与必选undefined的类型是不同类型
 */
export function findParent<T extends { [key in K]?: T | null | undefined }, K extends string>(
  { node, parentKey, findCondition, breakCondition }
    : {
      /** 要查找的节点 */
      node: T
      /** 父节点key */
      parentKey: K
      /** 查找条件 */
      findCondition: (node: T) => boolean
      /** 中止条件 */
      breakCondition?: (node: T) => boolean
    }
) {
  let parent: T | null | undefined = node

  while (parent) {

    if (breakCondition && breakCondition(parent)) {
      // 条件满足时 中断循环
      break
    }
    if (findCondition(parent)) {
      // 条件满足时 返回当前节点作为Parent
      return parent
    }
    parent = parent[parentKey]
  }
}