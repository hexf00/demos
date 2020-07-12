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
  }, (currKey: string) => {
    //缩进

    const index = this.parent.nodes.indexOf(this);

    console.log("tab", currKey, index);
    if (index == 0) {
      //已是最末端的节点
      return;
    }


    //引用的根节点不允许继续缩进

    const newParent = this.parent.nodes[index - 1];
    const my = this.parent.nodes.splice(index, 1);


    let path = currKey.split("-");
    path.pop();
    path.push(newParent.key)
    path.push(my[0].key)

    newParent.nodes.push(my[0]);


    my[0].parent = newParent;

    console.log("newPath", path.join("-"));
    //此处需要重新设置焦点
    // my[0].focus(path.join("-"));

    setTimeout(() => {
      my[0].focus(path.join("-"));
    }, 0)

    //成为相邻的靠前一个节点的子节点



    //引用中不再能实现超越引用的节点




  }, (currKey: string) => {
    //反缩进
    console.log("shiftTab", currKey);

    const index = this.parent.nodes.indexOf(this);
    const parent = this.parent as NodeService;
    //反缩进的逻辑是成为父级节点相邻的靠后一个同级节点
    const newParent = parent?.parent;
    if (newParent) {
      const my = this.parent.nodes.splice(index, 1);

      const parentIndex = newParent.nodes.indexOf(parent);

      newParent.nodes.splice(parentIndex + 1, 0, my[0]);



      my[0].parent = newParent;

      let path = currKey.split("-");
      path.pop();
      path.pop();
      path.push(my[0].key)

      setTimeout(() => {
        my[0].focus(path.join("-"));
      }, 0)


    }




  })

  //实例化预览Data
  preview = new NodePreviewService((key: string) => {
    this.focus(key);
  })
  hideEditor() {
    this.isShowEditor = false
  }
  /**
   *Creates an instance of NodeService.
   * @param {{
   *     value: string
   *     children: Tree<{
   *       value: string
   *     }>
   *   }} { value, children }
   * @param {{ add: (node: NodeService) => void }} callback
   * @param {NodeListService} root
   * @param {string} parentKey
   * @param {(NodeService | NodeListService)} parent
   * @memberof NodeService
   */
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

    this.nodes = children.map(item => new NodeService(item, this, root, this.key, this))
  }
  //item 为被操作的节点

  add(item: NodeService) {

    console.log("Add", item);
    let parent = item.parent;
    
    if (item.nodes.length > 0 /** 有子节点则创建子节点 */) {


      // 创建新节点,此处传参不一样
      const node = new NodeService({
        value: '',
        children: []
      }, this, this.root, this.key, this)

      item.nodes.push(node);


      let newKey = window.currFocus.split("-");
      newKey.push(node.key);


      node.focus(newKey.join("-"))
    } else /** 靠后创建同级节点 */ {
      const index = parent.nodes.indexOf(item)

      // 创建新节点,此处传参不一样
      const node = new NodeService({
        value: '',
        children: []
      }, this, this.root, this.key, this)
      parent.nodes.splice(index + 1, 0, node)

      // console.log("this.currFocus", this.currFocus)

      //引用中不再能实现超越引用的节点

      //插入同级节点

      let newKey = window.currFocus.split("-");
      newKey.pop();
      newKey.push(node.key);


      node.focus(newKey.join("-"))
    }


  }
  focus(currKey: string) {
    console.log("currKey", currKey);
    this.isShowEditor = true
    this.currFocus = currKey;
    window.currFocus = currKey;
    this.editor.focus()
  }
}
