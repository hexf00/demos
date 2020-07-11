import a from "./a";
declare global{
  interface Window { a: typeof a, b: string }
  
  namespace JSX { interface IntrinsicElements { [key: string]: any } } 
  type Tree<T, C extends string = 'children'> = Array<T & { [key in C]: Tree<T> }>

}
