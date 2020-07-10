import { INode } from "."
import DivInputService from "../div-input/service"

let key = 0
export default class NodeService implements INode {
  key = (key++).toString()
  nodes: NodeService[]
  editor = new DivInputService(() => {
    this.callback.add(this)
  })
  constructor({ value, children }: {
    value: string
    children: Tree<{
      value: string
    }>
  }, private callback: { add: (node: NodeService) => void }) {
    this.editor.value = value
    this.nodes = children.map(item => new NodeService(item, this))
  }
  add(item: NodeService) {
    const index = this.nodes.indexOf(item)
    const node = new NodeService({
      value: this.editor.value + '-',
      children: []
    }, this)
    this.nodes.splice(index + 1, 0, node)
    node.focus()
  }
  focus() {
    this.editor.focus()
  }
}
