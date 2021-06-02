declare global {
  // interface Window { }
}

namespace JSX {
  interface IntrinsicElements { [key: string]: any }

  // 给组件增加属性
  interface IntrinsicAttributes {
    key?: string | number
  }

  interface ElementAttributesProperty {
    $props: any // 配置JSX中属性类型检查
  }
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

/** 函数式组件 */
type FunctionalComponent<T> = (props: T | { props: T }) => void

/** 树结构 */
type Tree<T> = Array<TreeItem<T>>

/** 树结构Item */
type TreeItem<T> = T & { children: Tree<T> }