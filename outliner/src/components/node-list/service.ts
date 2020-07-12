import { INodeList } from "."
import NodeService from "../node/service"

export default class NodeListService implements INodeList {
  nodes: NodeService[]
  dict: {
    [key: string]: NodeService
  } = {}
  constructor(data: Tree<{ value: string }>) {
    this.nodes = data.map(item => new NodeService(item, this, this, '', this))
  }
  //被操作的节点
  add(item: NodeService) {

    let parent, parentKey:string[];
    console.log("NodeList ADD", this, item.parent);


    if (item.nodes.length > 0 /** 有子节点则创建子节点 */) {
      parent = item;
      parentKey = window.currFocus.split("-");
    } else /** 靠后创建同级节点 */ {
      parent = item.parent;
      parentKey = window.currFocus.split("-");
      parentKey.pop();
    }



    //表现应该和node一致，有子则创建子，没有则创建同级  

    const index = parent.nodes.indexOf(item)

    // 此处传参不一样
    const newNode = new NodeService({
      value: '',
      children: []
    }, this, this, '', parent)
    parent.nodes.splice(index + 1, 0, newNode)

    //同级
    parentKey.push(newNode.key);

    setTimeout(() => {
      newNode.focus(parentKey.join("-"))
    }, 0)




  }
}
