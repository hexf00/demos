declare global {
  // interface Window { }
}

namespace JSX {
  interface IntrinsicElements { [key: string]: any }
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