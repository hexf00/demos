import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { FC } from '../../common/vue-tsx'
import DivInput, { IDivInput } from '../div-input'

export interface INode {
  editor: IDivInput
  nodes: INode[]
  key: string
}


const NodeComponent = FC<{ service: INode }>({
  functional: true,
  render(h, context) {
    const { editor, nodes, key } = context.props.service

    let list = nodes.length > 0 ? (
      <ul>
        {nodes.map((node) => <NodeComponent service={node}></NodeComponent>)}
      </ul>) : "";
    
    return (
      <li key={key}>
        <DivInput service={editor}></DivInput>
        {list}
      </li>
    );

  }
})

export default NodeComponent
