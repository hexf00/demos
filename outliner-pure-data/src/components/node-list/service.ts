import { INodeList } from "."
import NodeService from "../node/service"

export default class NodeListService implements INodeList {
  nodes: NodeService[]
  dict: {
    [key: string]: NodeService
  } = {}

  key = '';
  isRoot = true;

  constructor(data: Tree<{ value: string }>) {
    this.nodes = data.map(item => new NodeService(item, this, this))
  }

}
