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
    this.nodes = data.map(item => new NodeService(item, this, this, this))
  }
  //被操作的节点
  add(item: NodeService) {

    let newParent, newNodeFocusKey: string[], insertMode: "push" | "splice";
    console.log("NodeList ADD", this, item.parent);


    if (item.nodes.length > 0 /** 有子节点则末尾创建子节点 */) {
      newParent = item;
      newNodeFocusKey = window.currFocus.split("-");
      insertMode = 'push';
    } else /** 靠后创建同级节点 */ {
      newParent = item.parent;
      newNodeFocusKey = window.currFocus.split("-");
      newNodeFocusKey.pop();
      insertMode = 'splice';
    }

    const newNode = new NodeService({
      value: '',
      children: []
    }, this, item.root, newParent);


    if (insertMode == "push") {
      newParent.nodes.push(newNode);
    } else if (insertMode == "splice") {
      const index = newParent.nodes.indexOf(item)
      newParent.nodes.splice(index + 1, 0, newNode)
    }

    //同级

    newNodeFocusKey.push(newNode.key);
    setTimeout(() => {
      newNode.focus(newNodeFocusKey.join("-"))
    }, 0)

  }
}
