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
    return <div key={key}>
      <DivInput service={editor}></DivInput>
      <div style="margin-left: 10px;">
        {nodes.map((node) => <NodeComponent service={node}></NodeComponent>)}
      </div>
    </div>

  }
})

export default NodeComponent