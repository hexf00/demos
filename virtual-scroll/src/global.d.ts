import a from "./a";
declare global{
  interface Window { a: typeof a, b: string }
  
  namespace JSX { interface IntrinsicElements { [key: string]: any } } 

}
