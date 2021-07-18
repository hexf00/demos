declare global {
  // interface Window { }
}

declare module 'element-ui/src/utils/clickoutside'
declare module 'element-ui/src/utils/dom'
declare module 'element-ui/lib/select'
declare module '@/components/select/index'
namespace JSX {
  interface IntrinsicElements { [key: string]: any }

  // 给组件增加属性
  interface IntrinsicAttributes {
    key?: string | number
    class?: string | string[]
    placeholder?: string
  }

  interface ElementAttributesProperty {
    $props: any
  }
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

/** 函数式组件 */
type FunctionalComponent<T> = (props: T | { props: T }) => void