import a from "./a"
declare global {

  interface Window {
    a: typeof a,
    b: string
    currFocus: string
  }

  namespace JSX {
    interface IntrinsicElements { [key: string]: any }
    interface ElementAttributesProperty {
      $props: any // 设置类组件的类型检查属性
    }
  }
  type Tree<T, C extends string = 'children'> = Array<T & { [key in C]: Tree<T> }>
}
