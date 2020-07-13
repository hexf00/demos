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
    this.onEnter(this)
  }, () => {
    //blur 失去焦点事件
    this.hideEditor()

    // focusPath不应该销毁，而应该持续保留。
    // this.currentFocusPath = undefined;
  }, (value: string) => {
    this.value = value
    this.preview.value = value
  }, () => this.tab()
    , () => this.shiftTab()
    , () => this.moveFocusUp())

  //实例化预览Data
  preview = new NodePreviewService((nodePath: NodePath) => {
    this.focus(nodePath);
  })
  hideEditor() {
    this.isShowEditor = false
  }

  constructor({ value, children }: {
    value: string
    children: Tree<{
      value: string
    }>
  },
    root: NodeListService,
    parent: NodeService | NodeListService) {
    this.key = (key++).toString();

    this.root = root;
    this.value = value
    this.editor.value = value
    this.preview.value = value
    this.parent = parent;

    //添加到字典中
    this.root.dict[this.key] = this;

    this.nodes = children.map(item => new NodeService(item, root, this))
  }

  //item 为被操作的节点
  onEnter(item: NodeService) {
    let newParent, newIndex, newParentFullPath;
    if (item.nodes.length > 0 /** 创建子节点在首位 */) {
      newParent = item;
      newIndex = 0;
      newParentFullPath = item.currentFocusPath;
    } else /** 创建靠后同级节点 */ {
      newParent = item.parent;
      newIndex = newParent.nodes.indexOf(item) + 1;
      newParentFullPath = item.currentFocusPath?.getParent();
    }

    const newNode = new NodeService({
      value: '',
      children: []
    }, item.root, newParent);
    //改变位置
    newParent.nodes.splice(newIndex, 0, newNode);
    //激活焦点
    newParentFullPath && newNode.moveFocus(newParentFullPath);
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

  /**
   * 因为引用的原因，由于一个nodeService和多个dom存在映射关系
   * currentFocusDomPath是一个Vue的概念，而非数据概念
   * 所以通过
   * @param currentFocusDomPathString 
   */
  focus(nodePath: NodePath) {
    setTimeout(() => {
      this.isShowEditor = true
      this.currentFocusPath = nodePath
      this.editor.focus()
    }, 0)
  }

  //更新currentFocusPath 并 激活焦点
  moveFocus(newParentFullPath: NodePath) {
    if (!this.currentFocusPath) {
      this.currentFocusPath = new NodePath(this.key);
    }

    this.currentFocusPath.moveTo(newParentFullPath);
    this.focus(this.currentFocusPath);
  }

  moveFocusUp() {
    if (this.currentFocusPath) {
      return;
    }

    
  }
}
