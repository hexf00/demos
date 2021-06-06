import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/umd'
import TreeNode, { iTreeNode } from './node'

export interface iTree {
  nodes: iTreeNode[]
}

@Component
export default class Tree extends Vue {
  $props!: {
    service: iTree
  }
  @Prop() service!: iTree
  render(h: CreateElement) {
    return <div>
      {this.service.nodes.map(node => <TreeNode service={node}></TreeNode>)}
    </div>
  }
}