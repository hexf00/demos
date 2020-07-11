import { INode } from "."
import DivInputService from "../div-input/service"
import NodeListService from "../node-list/service"
import NodePreviewService from "../node-preview/service"

let key = 0
export default class NodeService implements INode {
  key: string
  value: string
  nodes: NodeService[]
  root: NodeListService
  isShowEditor: boolean = false



  //实例化编辑器Data
  editor = new DivInputService(() => {
    this.callback.add(this)
  }, () => {
      this.hideEditor()
  }, (value:string) => {
      this.value = value
      this.preview.value = value
  })

  //实例化预览Data
  preview = new NodePreviewService(() => {
    this.showEditor();
  })

  showEditor() {
    console.log("isShowEditor", this.isShowEditor);
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
    root: NodeListService,
    parentKey: string) {
    this.key = parentKey + (key++).toString();

    this.root = root;
    this.value = value
    this.editor.value = value
    this.preview.value = value

    //建立字典
    this.root.dict[this.key] = this;

    this.nodes = children.map(item => new NodeService(item, this, root, this.key))
  }
  add(item: NodeService) {
    const index = this.nodes.indexOf(item)

    // 创建新节点
    const node = new NodeService({
      value: '',
      children: []
    }, this, this.root, this.key)
    this.nodes.splice(index + 1, 0, node)
    node.focus()
  }
  focus() {
    this.editor.focus()
  }
}
