import { INode } from "."
import DivInputService from "../div-input/service"
import NodeListService from "../node-list/service"
import NodePreviewService from "../node-preview/service"
import { NodePath } from "../../common/NodePath"

let key = 0
export default class NodeService implements INode {
  key: string
  value: string
  nodes: NodeService[]
  parent: NodeService | NodeListService
  root: NodeListService
  isShowEditor: boolean = false
  currentFocusPath?: NodePath
  isRoot = false


  //实例化编辑器Data
  editor = new DivInputService(() => {
    this.callback.add(this)
  }, () => {
    //blur 失去焦点事件
    this.hideEditor()

    //说明 focusPath不应该销毁，而应该持续保留。
    // this.currentFocusPath = undefined;
  }, (value: string) => {
    this.value = value
    this.preview.value = value
  }, () => this.tab(), () => this.shiftTab())

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

    this.nodes = children.map(item => new NodeService(item, this, root, this))
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
      }, this, this.root, this)

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
      }, this, this.root, this)
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

  /**
   * 因为引用的原因，由于一个nodeService和多个dom存在映射关系
   * currentFocusDomPath是一个Vue的概念，而非数据概念
   * 所以通过
   * @param currentFocusDomPathString 
   */
  focus(currentFocusDomPathString?: string) {
    console.log("currKey", currentFocusDomPathString);
    this.isShowEditor = true
    if (currentFocusDomPathString) {
      this.currentFocusPath = new NodePath(currentFocusDomPathString);
    }
    this.editor.focus()
  }
  tab() {
    //缩进
    //成为同级相邻靠前节点的子节点

    //vue组件中判断
    //引用的根节点不允许继续缩进
    //引用中不再能实现超越引用的节点 

    const index = this.parent.nodes.indexOf(this);
    if (index == 0 /** 第一个子节点是末端节点 */) {
      return;
    }

    const newParent = this.parent.nodes[index - 1];
    const newParentFullPath = this.currentFocusPath?.getParent().cd(newParent.key);

    this.moveTo({
      newParent
    });
    newParentFullPath && this.moveFocus(newParentFullPath)
  }
  shiftTab() {
    //反缩进
    //成为父级相邻靠后节点的同级节点

    // 引用根节点和引用节点的一级子几点不可再反缩进 （已在vue中处理）
    // 一级节点不可再反缩进

    if (this.parent.isRoot /** 一级节点不可再反缩进 */) {
      return;
    }
    const oldParent: NodeService = this.parent as NodeService;
    const newParent = (oldParent)?.parent;

    if (newParent) {
      const newIndex = newParent.nodes.indexOf(oldParent) + 1;

      const newParentFullPath = this.currentFocusPath?.getParent().getParent();

      this.moveTo({
        newParent,
        newIndex
      });
      newParentFullPath && this.moveFocus(newParentFullPath);
    }
  }
  moveTo({ newParent, newIndex = -1 }: {
    newParent: NodeService | NodeListService,
    newIndex?: number
  }) {

    const oldParent = this.parent;
    //1. 从原parent处删除
    if (oldParent) {
      const index = oldParent.nodes.indexOf(this);
      oldParent.nodes.splice(index, 1);
    }

    //2. 插入到新的parent
    if (newIndex !== -1 /** 插入到指定位置 */) {
      newParent.nodes.splice(newIndex, 0, this);
    } /** 插入到尾部 */ else {
      newParent.nodes.push(this);
    }

    //3. 更新parent
    this.parent = newParent;


  }
  //更新currentFocusPath 并 激活焦点
  moveFocus(newParentFullPath: NodePath) {
    if (this.currentFocusPath) {
      this.currentFocusPath.moveTo(newParentFullPath);

      //暂时不清楚为什么focus不能删除
      setTimeout(() => {
        this.focus();
      }, 0)
    }
  }
}
