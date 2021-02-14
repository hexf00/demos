declare global {
  interface Window { }
}

namespace JSX {
  interface IntrinsicElements { [key: string]: any }
  interface ElementAttributesProperty {
    $props: any
  }
}