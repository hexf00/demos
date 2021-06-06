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
