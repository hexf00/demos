declare global {
  // interface Window { }
}

declare module 'element-ui/src/utils/clickoutside'
declare module 'element-ui/src/utils/dom'
declare module 'element-ui/lib/select'
declare module '@/components/select/index'
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