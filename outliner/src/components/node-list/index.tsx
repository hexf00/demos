import { FC } from '../../common/vue-tsx'
import NodeComponent, { INode } from '../node'

export interface INodeList {
  nodes: INode[]
}


const NodeList = FC<{ service: INodeList }>({
  functional: true,
  render(h, context) {
    const { nodes } = context.props.service
    return nodes.map(item => <NodeComponent service={item}></NodeComponent>)
  }
})

export default NodeList