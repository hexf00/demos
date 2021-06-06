import { Already, Concat, Root, Service } from 'ioc-di'
import { iTree } from '.'
import ITreeNode from './node/service'

type item = {
  id: string
  value: string
}

type data = Array<item & { children: data }>

export function mapChild_inner<T extends Record<string, any>, K, U extends string>(arr: T[], childKey: U, callback: (arg: T, children: K[]) => K): K[] {
  return arr.map(item => {
    const children = item[childKey] as T[]
    if (Array.isArray(children)) {
      return callback(item, mapChild_inner(children, childKey, callback))
    } else {
      return callback(item, [])
    }
  })
}

@Root()
@Service()
export default class ITree implements iTree {
  nodes: ITreeNode[] = []

  @Already
  setData(data: data) {
    this.nodes = mapChild_inner(data, 'children', (item, children) => {
      const node = Concat(this, new ITreeNode({
        value: item.value,
        children,
      }))
      children.forEach(item => item.setParent(node))
      return node
    })
    console.log(this.nodes)
  }
}