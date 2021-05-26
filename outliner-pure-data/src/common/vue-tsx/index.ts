import { FunctionalComponentOptions } from "vue"

export function FC<T extends object>(Compoenent: FunctionalComponentOptions<T>): (props: T | { props: T }) => void {
  return Compoenent as any
}