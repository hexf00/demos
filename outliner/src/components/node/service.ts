import { INode } from "."
import DivInputService from "../div-input/service"
import NodeListService from "../node-list/service"

let key = 0
export default class NodeService implements INode {
  key = (key++).toString()
  nodes: NodeService[]
  root: NodeListService
  isShowEditor: boolean = false


  editor = new DivInputService(() => {
    this.callback.add(this)
  }, () => {
    this.hideEditor()
  })

  showEditor() {
    this.isShowEditor = true
    this.focus()
  }
  hideEditor() {
    this.isShowEditor = false
  }
  constructor({ value, children }: {
    value: string
    children: Tree<{
      value: string
    }>
  }, private callback: { add: (node: NodeService) => void },
    root: NodeListService) {
    this.root = root;
    this.editor.value = value

    //建立字典
    this.root.dict[this.key] = this;

    this.nodes = children.map(item => new NodeService(item, this, root))
  }
  add(item: NodeService) {
    const index = this.nodes.indexOf(item)

    // 创建新节点
    const node = new NodeService({
      value: '',
      children: []
    }, this, this.root)
    this.nodes.splice(index + 1, 0, node)
    node.focus()
  }
  focus() {
    this.editor.focus()
  }
}
