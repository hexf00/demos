import { INode } from "."
import DivInputService from "../div-input/service"
import NodeListService from "../node-list/service"
import NodePreviewService from "../node-preview/service"

let key = 0
export default class NodeService implements INode {
  key: string
  value: string
  nodes: NodeService[]
  parent: NodeService | NodeListService
  root: NodeListService
  isShowEditor: boolean = false
  currFocus: string = ""



  //实例化编辑器Data
  editor = new DivInputService(() => {
    this.callback.add(this)
  }, () => {
    this.hideEditor()
  }, (value: string) => {
    this.value = value
    this.preview.value = value
  }, (currKey:string) => {

      const index = this.parent.nodes.indexOf(this);

      console.log("tab", index);
      if (index == 0) {
        //已是最末端的节点
        return;
      }

      const newParent = this.parent.nodes[index - 1];
      const my = this.parent.nodes.splice(index,1);
      
      newParent.nodes.push(my[0]);

      my[0].parent = newParent;


      my[0].focus();

      //成为相邻的前一个节点的子节点


  })

  //实例化预览Data
  preview = new NodePreviewService((key: string) => {
    this.focus(key);
  })
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
    parentKey: string,
    parent: NodeService | NodeListService) {
    this.key = (key++).toString();

    this.root = root;
    this.value = value
    this.editor.value = value
    this.preview.value = value
    this.parent = parent;
    // this.add = this.callback.add;

    //建立字典
    this.root.dict[this.key] = this;

    this.nodes = children.map(item => new NodeService(item, this, root, this.key,this))
  }
  add(item: NodeService) {
    const index = this.nodes.indexOf(item)

    // 创建新节点,此处传参不一样
    const node = new NodeService({
      value: '',
      children: []
    }, this, this.root, this.key, this)
    this.nodes.splice(index + 1, 0, node)

    // console.log("this.currFocus", this.currFocus)

    //引用中不再能实现超越引用的节点

    //插入同级节点

    let newKey = window.currFocus.split("-");
    newKey.pop();
    newKey.push(node.key);


    node.focus(newKey.join("-"))
  }
  focus(currKey: string) {
    console.log("currKey", currKey);
    this.isShowEditor = true
    this.currFocus = currKey;
    window.currFocus = currKey;
    this.editor.focus()
  }
}
