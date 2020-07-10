import { INodeList } from "."
import NodeService from "../node/service"

export default class NodeListService implements INodeList {
  nodes: NodeService[]
  dict: {
    [key: string]: NodeService
  } = {}
  constructor(data: Tree<{value: string }>) {
    this.nodes = data.map(item => new NodeService(item, this, this))
  }
  add(item: NodeService) {
    const index = this.nodes.indexOf(item)
    const node = new NodeService({
      value: '',
      children: []
    }, this, this)
    this.nodes.splice(index + 1, 0, node)
    node.focus()
  }
}