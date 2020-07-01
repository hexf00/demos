import a from "./a";
declare global{
  interface Window { a:  typeof a,b:string }
}
