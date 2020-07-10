import { FC } from '../../common/vue-tsx'
import NodeComponent, { INode } from '../node'
import NodeService from '../node/service'

export interface INodeList {
  nodes: INode[];
  dict: {
    [key: string]: NodeService
  }
}


const NodeList = FC<{ service: INodeList }>({
  functional: true,
  render(h, context) {
    const { nodes } = context.props.service
    return nodes.map(item => <NodeComponent service={item}></NodeComponent>)
  }
})

export default NodeList
